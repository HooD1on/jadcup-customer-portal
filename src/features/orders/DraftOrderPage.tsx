import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  RefreshCcw,
  Lock,
  Zap,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { ProductImage } from '../../components/ui/ProductImage';
import { Modal } from '../../components/ui/Modal';
import { ordersApi, type ReorderResult, type OrderItemStatus } from '../../services/ordersApi';
import { PortalApiError } from '../../services/portalAccountApi';
import { formatCurrency } from '../../lib/format';
import { useLanguage } from '../language/LanguageContext';
import { useAuth } from '../auth/AuthContext';

interface DraftRow {
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

// order.products[] (显示用) 和 items[] (编辑状态用) 是两个不同形状的数组,靠后端在同一次
// 循环里按同样的顺序生成——没有共同的 key 能直接对上,只能按下标位置一一对应合并成一行。
function buildRows(data: ReorderResult): DraftRow[] {
  return data.items.map((item, index) => {
    const product = data.order.products[index];
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
  });
}

export function DraftOrderPage() {
  const { language, t } = useLanguage();
  const locale = language === 'zh' ? 'zh-CN' : 'en-NZ';
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sourceOrderId = searchParams.get('from');
  const { session } = useAuth();

  const [data, setData] = useState<ReorderResult>();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string>();
  const [savingItemId, setSavingItemId] = useState<string>();
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({});
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [pageError, setPageError] = useState<string>();

  useEffect(() => {
    const state = location.state as ReorderResult | undefined;
    if (!state) return;
    setData(state);
    setRows(buildRows(state));
    setOrderTotal(state.order.totalPrice);
    setIsUrgent(false);
  }, [location.state]);

  const handleRegenerate = async () => {
    if (!sourceOrderId || !session?.token) return;
    setRegenerating(true);
    setRegenerateError(undefined);
    try {
      const result = await ordersApi.reorder(sourceOrderId, session.token);
      navigate(`/orders/${result.order.orderId}/draft?from=${sourceOrderId}`, {
        replace: true,
        state: result,
      });
    } catch (err) {
      setRegenerateError(err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'));
    } finally {
      setRegenerating(false);
    }
  };

  const applyQuantity = async (row: DraftRow) => {
    if (!data || !session?.token) return;
    const draftValue = quantityDrafts[row.itemId];
    if (draftValue === undefined) return;
    const parsed = Number(draftValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setRowErrors((prev) => ({ ...prev, [row.itemId]: t('Enter a quantity greater than 0.', '数量必须大于 0。') }));
      return;
    }
    if (parsed === row.quantity) {
      setQuantityDrafts((prev) => { const next = { ...prev }; delete next[row.itemId]; return next; });
      return;
    }

    setSavingItemId(row.itemId);
    setRowErrors((prev) => { const next = { ...prev }; delete next[row.itemId]; return next; });
    try {
      const result = await ordersApi.updateOrderItem(data.order.orderId, row.itemId, { quantity: parsed }, session.token);
      setRows((prev) => prev.map((r) => (r.itemId === row.itemId
        ? { ...r, quantity: result.item.quantity, unitPrice: result.item.unitPrice }
        : r)));
      setOrderTotal(result.orderTotalPrice);
      setQuantityDrafts((prev) => { const next = { ...prev }; delete next[row.itemId]; return next; });
    } catch (err) {
      setRowErrors((prev) => ({
        ...prev,
        [row.itemId]: err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'),
      }));
    } finally {
      setSavingItemId(undefined);
    }
  };

  const toggleIncluded = async (row: DraftRow) => {
    if (!data || !session?.token || row.locked) return;
    setSavingItemId(row.itemId);
    setRowErrors((prev) => { const next = { ...prev }; delete next[row.itemId]; return next; });
    try {
      const result = await ordersApi.updateOrderItem(
        data.order.orderId,
        row.itemId,
        { included: !row.included },
        session.token,
      );
      setRows((prev) => prev.map((r) => (r.itemId === row.itemId ? { ...r, included: result.item.included } : r)));
      setOrderTotal(result.orderTotalPrice);
    } catch (err) {
      setRowErrors((prev) => ({
        ...prev,
        [row.itemId]: err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'),
      }));
    } finally {
      setSavingItemId(undefined);
    }
  };

  const toggleUrgent = async () => {
    if (!data || !session?.token) return;
    const next = !isUrgent;
    setIsUrgent(next);
    try {
      const result = await ordersApi.updateUrgentFlag(data.order.orderId, next, session.token);
      setIsUrgent(result.isUrgent);
      setOrderTotal(result.orderTotalPrice);
    } catch (err) {
      setIsUrgent(!next);
      setRegenerateError(err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'));
    }
  };

  const handleSubmit = async () => {
    if (!data || !session?.token) return;
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const response = await ordersApi.submitOrder(data.order.orderId, session.token);

      if (response.success) {
        navigate(`/orders/${data.order.orderId}`);
        return;
      }

      if (response.errorCode === 'order_has_invalid_items' && response.data?.invalidItems) {
        // 提交时后端会重新校验一遍报价,草稿编辑期间还有效的行,到提交这一刻可能已经过期——
        // 用后端返回的最新状态覆盖对应行,而不是只弹一句"提交失败",让客户知道具体是哪几行。
        const invalidByItemId = new Map(response.data.invalidItems.map((item) => [item.itemId, item]));
        setRows((prev) => prev.map((row) => {
          const invalid = invalidByItemId.get(row.itemId);
          return invalid ? { ...row, locked: true, status: invalid.status, included: invalid.included } : row;
        }));
        // 关掉弹窗,把提示放到页面上、跟被标记的那几行放在一起——留着弹窗客户看不到
        // 究竟是哪几行出了问题。
        setSubmitModalOpen(false);
        setPageError(t(
          'Some items no longer have a valid quotation — they’ve been marked below. Uncheck them or request a new quote, then try again.',
          '有几行商品的报价已经失效——已经在下方标出来了。取消勾选或重新询价之后再试一次。',
        ));
        return;
      }

      setSubmitError(response.errorMessage || t('Unable to submit this order. Please try again.', '无法提交订单，请重试。'));
    } catch (err) {
      setSubmitError(err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'));
    } finally {
      setSubmitting(false);
    }
  };

  // 没有路由跳转带过来的编辑数据(比如刷新了页面) —— 这个方案下确实拿不回来,
  // 但要让它看起来像"有意为之"的设计,而不是页面坏了。
  if (!data) {
    return (
      <PageShell>
        <div className="max-w-lg mx-auto text-center py-16 px-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4 mx-auto">
            <RefreshCcw className="text-amber-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('Your draft needs to be regenerated', '你的草稿需要重新生成')}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-2">
            {t(
              "We don't keep draft edits in progress after a page refresh — pricing is checked fresh each time you start a reorder. Regenerate the draft to pick up where you left off.",
              '页面刷新后，正在编辑的草稿内容不会被保留——每次重新订购都会重新检查一遍最新价格。点击下方按钮重新生成草稿即可继续。',
            )}
          </p>
          {regenerateError && (
            <p className="text-sm text-red-600 mb-3">{regenerateError}</p>
          )}
          {sourceOrderId ? (
            <Button variant="primary" onClick={handleRegenerate} disabled={regenerating}>
              <RefreshCcw size={15} />
              {regenerating ? t('Regenerating...', '正在重新生成……') : t('Regenerate Draft', '重新生成草稿')}
            </Button>
          ) : (
            <Link to="/orders" className="no-underline">
              <Button variant="outline">
                <ArrowLeft size={16} /> {t('Back to Orders', '返回订单列表')}
              </Button>
            </Link>
          )}
        </div>
      </PageShell>
    );
  }

  const { order } = data;

  return (
    <PageShell>
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-jade-700 no-underline mb-4">
        <ArrowLeft size={14} />
        {t('Back to Orders', '返回订单列表')}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{order.orderNo}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-(--radius-badge) bg-amber-50 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              {t('Draft', '草稿')}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {t('Review and adjust before submitting for review.', '提交审核之前，请先检查并调整以下内容。')}
          </p>
        </div>
      </div>

      {pageError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-(--radius-card) px-4 py-3 mb-6">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {pageError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card)">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                {t('Products', '产品')} ({rows.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {rows.map((row) => (
                <div key={row.itemId} className={`p-4 sm:p-5 ${row.locked ? 'bg-gray-50' : ''}`}>
                  <div className="flex gap-4">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={row.included}
                        disabled={row.locked || savingItemId === row.itemId}
                        onChange={() => toggleIncluded(row)}
                        className="w-4 h-4 rounded border-gray-300 text-jade-600 focus:ring-jade-500 disabled:opacity-40"
                        aria-label={t('Include in order', '计入订单')}
                      />
                    </div>
                    <ProductImage src={row.productImage} alt={row.productName} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold mb-0.5 break-words ${row.locked ? 'text-gray-400' : 'text-gray-900'}`}>
                        {row.productName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {row.customerProductCode || row.productCode}
                      </p>

                      {row.locked && (
                        <p className="flex items-center gap-1.5 text-xs text-amber-600 mb-3">
                          <Lock size={12} />
                          {t(
                            'Quotation unavailable — please request a new quote.',
                            '暂无有效报价——请重新询价。',
                          )}
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
                            disabled={row.locked || savingItemId === row.itemId}
                            value={quantityDrafts[row.itemId] ?? String(row.quantity)}
                            onChange={(e) => setQuantityDrafts((prev) => ({ ...prev, [row.itemId]: e.target.value }))}
                            onBlur={() => applyQuantity(row)}
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
                      {rowErrors[row.itemId] && (
                        <p className="text-xs text-red-600 mt-2">{rowErrors[row.itemId]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              {t('Delivery Information', '配送信息')}
            </h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">{t('Delivery Name', '收货名称')}</p>
                <p className="text-sm text-gray-900">{order.deliveryName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('Address', '地址')}</p>
                <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Zap size={15} className="text-amber-500" />
                {t('Mark as Urgent', '标记为加急')}
              </span>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={toggleUrgent}
                className="w-4 h-4 rounded border-gray-300 text-jade-600 focus:ring-jade-500"
              />
            </label>
            {isUrgent && (
              <p className="text-xs text-gray-500 mt-2">
                {t(
                  'An additional urgent fee may apply — the exact amount will be confirmed by our team.',
                  '加急可能产生额外费用，具体金额将由我们的团队确认。',
                )}
              </p>
            )}
          </div>

          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">{t('Order Total', '订单总计')}</h2>
            <div className="text-center py-2 mb-3">
              <p className="text-2xl font-bold text-jade-700">{formatCurrency(orderTotal, locale)}</p>
              <p className="text-xs text-gray-400 mt-1">{t('Including GST', '含 GST')}</p>
            </div>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => { setSubmitError(undefined); setPageError(undefined); setSubmitModalOpen(true); }}
              disabled={!rows.some((row) => row.included)}
            >
              <Send size={15} /> {t('Submit Order', '提交订单')}
            </Button>
            {!rows.some((row) => row.included) && (
              <p className="text-xs text-gray-400 text-center mt-2">
                {t('Select at least one item to submit.', '至少勾选一项才能提交。')}
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={submitModalOpen}
        onClose={() => { if (!submitting) setSubmitModalOpen(false); }}
        title={t('Submit this order for review?', '提交这份订单进行审核？')}
        footer={
          <>
            <Button variant="outline" onClick={() => setSubmitModalOpen(false)} disabled={submitting}>
              {t('Cancel', '取消')}
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? t('Submitting...', '正在提交……') : t('Submit', '确认提交')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {t(
            "We'll re-check pricing on every selected item one more time before submitting. Once submitted, this order moves to review and can no longer be edited here.",
            '提交前我们会对每一个已勾选的商品再核实一遍最新报价。提交之后订单会进入审核流程，这里就不能再编辑了。',
          )}
        </p>
        {submitError && (
          <p className="flex items-start gap-1.5 text-sm text-red-600 mt-3">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            {submitError}
          </p>
        )}
      </Modal>
    </PageShell>
  );
}
