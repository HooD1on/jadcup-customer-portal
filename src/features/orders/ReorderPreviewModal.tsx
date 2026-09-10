import { useEffect, useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ProductImage } from '../../components/ui/ProductImage';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ordersApi, type ReorderResult, type OrderItemStatus } from '../../services/ordersApi';
import { PortalApiError } from '../../services/portalAccountApi';
import { formatCurrency } from '../../lib/format';
import { useLanguage } from '../language/LanguageContext';
import { useAuth } from '../auth/AuthContext';

interface PreviewRow {
  itemId: string;
  productId: number;
  productName: string;
  productCode: string;
  customerProductCode: string | null;
  productImage: string | null;
  unitPrice: number | null;
  quantity: number;
  included: boolean;
  locked: boolean;
  status: OrderItemStatus['status'];
}

interface ReorderPreviewModalProps {
  isOpen: boolean;
  sourceOrderId: string;
  onClose: () => void;
  onConfirmed: (result: ReorderResult, sourceOrderId: string) => void;
}

// Preview 阶段的调整都是本地状态,不发请求——数量/是否勾选只有在客户点确认的那一刻,
// 才会跟着 sourceOrderId 一起发给 /reorder/confirm。后端会重新校验一遍报价再落库,
// 不信任这里显示的价格。
export function ReorderPreviewModal({ isOpen, sourceOrderId, onClose, onConfirmed }: ReorderPreviewModalProps) {
  const { language, t } = useLanguage();
  const locale = language === 'zh' ? 'zh-CN' : 'en-NZ';
  const { session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [rows, setRows] = useState<PreviewRow[]>();
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string>();

  useEffect(() => {
    if (!isOpen || !session?.token) return;
    let cancelled = false;

    setLoading(true);
    setLoadError(undefined);
    setRows(undefined);
    setConfirmError(undefined);

    ordersApi.reorderPreview(sourceOrderId, session.token)
      .then((preview) => {
        if (cancelled) return;
        setRows(preview.items.map((item, index) => {
          const product = preview.products[index];
          return {
            itemId: item.itemId,
            productId: item.productId,
            productName: product?.productName ?? '',
            productCode: product?.productCode ?? '',
            customerProductCode: product?.customerProductCode ?? null,
            productImage: product?.productImage ?? null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            included: item.included,
            locked: item.locked,
            status: item.status,
          };
        }));
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sourceOrderId, session?.token]);

  const total = (rows ?? [])
    .filter((row) => row.included)
    .reduce((sum, row) => sum + (row.unitPrice ?? 0) * row.quantity, 0);

  const toggleIncluded = (itemId: string) => {
    setRows((prev) => prev?.map((row) => (
      row.itemId === itemId && !row.locked ? { ...row, included: !row.included } : row
    )));
  };

  const setQuantity = (itemId: string, value: string) => {
    const parsed = Number(value);
    setRows((prev) => prev?.map((row) => (
      row.itemId === itemId ? { ...row, quantity: Number.isFinite(parsed) && parsed > 0 ? parsed : row.quantity } : row
    )));
  };

  const handleConfirm = async () => {
    if (!rows || !session?.token) return;
    setConfirming(true);
    setConfirmError(undefined);
    try {
      const result = await ordersApi.reorderConfirm(
        sourceOrderId,
        rows.map((row) => ({ itemId: row.itemId, quantity: row.quantity, included: row.included })),
        session.token,
      );
      onConfirmed(result, sourceOrderId);
    } catch (err) {
      setConfirmError(err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'));
    } finally {
      setConfirming(false);
    }
  };

  const busy = confirming;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { if (!busy) onClose(); }}
      title={t('Reorder — review latest prices', '再次订购——请核对最新价格')}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            {t('Cancel', '取消')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={busy || loading || !rows || !rows.some((row) => row.included)}
          >
            {confirming ? t('Creating draft...', '正在生成草稿……') : t('Confirm & Create Draft', '确认并生成草稿')}
          </Button>
        </>
      }
    >
      {loading && <LoadingState />}

      {!loading && loadError && (
        <p className="flex items-start gap-1.5 text-sm text-red-600">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          {loadError}
        </p>
      )}

      {!loading && rows && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            {t(
              "Prices below reflect each item's current quotation, not what you paid last time. Adjust quantities or uncheck items, then confirm to create the draft.",
              '以下价格是每个商品当前的最新报价，不是您上次下单时的价格。可以调整数量或取消勾选，确认后即可生成草稿订单。',
            )}
          </p>

          <div className="divide-y divide-gray-100 border border-gray-100 rounded-(--radius-card)">
            {rows.map((row) => (
              <div key={row.itemId} className={`p-3 sm:p-4 ${row.locked ? 'bg-gray-50' : ''}`}>
                <div className="flex gap-3">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={row.included}
                      disabled={row.locked}
                      onChange={() => toggleIncluded(row.itemId)}
                      className="w-4 h-4 rounded border-gray-300 text-jade-600 focus:ring-jade-500 disabled:opacity-40"
                      aria-label={t('Include in order', '计入订单')}
                    />
                  </div>
                  <ProductImage src={row.productImage} alt={row.productName} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold mb-0.5 break-words ${row.locked ? 'text-gray-400' : 'text-gray-900'}`}>
                      {row.productName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {row.customerProductCode || row.productCode}
                    </p>

                    {row.locked && (
                      <p className="flex items-center gap-1.5 text-xs text-amber-600 mb-2">
                        <Lock size={12} />
                        {t('Quotation unavailable — please request a new quote.', '暂无有效报价——请重新询价。')}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-2 items-end">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">{t('Unit Price', '单价')}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {row.unitPrice !== null ? formatCurrency(row.unitPrice, locale) : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase mb-0.5">{t('QTY', '数量')}</p>
                        <input
                          type="number"
                          min={1}
                          disabled={row.locked}
                          value={row.quantity}
                          onChange={(e) => setQuantity(row.itemId, e.target.value)}
                          className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">{t('Price', '金额')}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency((row.unitPrice ?? 0) * row.quantity, locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-sm text-gray-500">{t('Total (incl. GST)', '总计（含GST）')}</span>
            <span className="text-lg font-bold text-jade-700">{formatCurrency(total, locale)}</span>
          </div>

          {!rows.some((row) => row.included) && (
            <p className="text-xs text-gray-400 text-right mt-1">
              {t('Select at least one item to continue.', '至少勾选一项才能继续。')}
            </p>
          )}

          {confirmError && (
            <p className="flex items-start gap-1.5 text-sm text-red-600 mt-3">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              {confirmError}
            </p>
          )}
        </>
      )}
    </Modal>
  );
}
