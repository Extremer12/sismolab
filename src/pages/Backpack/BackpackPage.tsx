import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Share2,
  Calendar,
  AlertTriangle,
  Plus,
  Users,
  Clock,
  ShieldCheck,
  ChevronDown,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { ScreenId, BackpackItem, BackpackCategory } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  loadBackpackInventory,
  saveBackpackInventory,
  loadFamilyPlan,
  generateWhatsAppShoppingList,
  BACKPACK_CATEGORIES_META,
  getItemFallbackImage,
} from '../../services/familyBackpackService';

interface BackpackPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const BackpackPage: React.FC<BackpackPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const es = language === 'es';

  const [familyPlan] = useState(() => loadFamilyPlan());
  const [items, setItems] = useState<BackpackItem[]>(() =>
    loadBackpackInventory(familyPlan.members.length)
  );
  const [selectedCategory, setSelectedCategory] = useState<BackpackCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'packed' | 'perishable'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Form states for new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState<BackpackCategory>('especiales');

  useEffect(() => {
    saveBackpackInventory(items);
  }, [items]);

  const totalCount = items.length;
  const packedCount = items.filter((i) => i.is_packed).length;
  const missingCount = totalCount - packedCount;
  const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Toggle item packed status
  const toggleItemPacked = (id: string) => {
    sound.playClick();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_packed: !item.is_packed } : item))
    );
  };

  const handleUpdateExpiry = (id: string, date: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expiry_date: date } : item))
    );
  };

  const handleShareWhatsApp = () => {
    sound.playClick();
    const text = generateWhatsAppShoppingList(familyPlan, items);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    sound.playClick();
    const newItem: BackpackItem = {
      id: 'custom-' + Date.now(),
      category: newItemCategory,
      name: newItemName.trim(),
      description: es ? 'Insumo agregado para la protección familiar.' : 'Custom emergency supply.',
      quantity: 1,
      required_quantity: parseInt(newItemQuantity, 10) || 1,
      unit: 'u.',
      is_packed: true,
      is_perishable: false,
      image: getItemFallbackImage(newItemCategory),
    };

    setItems((prev) => [newItem, ...prev]);
    setNewItemName('');
    setNewItemQuantity('1');
    setShowAddModal(false);
  };

  // Filter items by category and status
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (statusFilter === 'missing') return !item.is_packed;
      if (statusFilter === 'packed') return item.is_packed;
      if (statusFilter === 'perishable') return item.is_perishable;
      return true;
    });
  }, [items, selectedCategory, statusFilter]);

  // Expiry badge helper
  const getExpiryBadge = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const now = new Date().getTime();
    const expTime = new Date(expiryDate).getTime();
    const diffDays = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          {es ? 'VENCIDO' : 'EXPIRED'}
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-600" />
          {es ? `Vence en ${diffDays}d` : `Expires in ${diffDays}d`}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
        <Calendar className="w-3 h-3 text-slate-400" />
        {expiryDate}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950 pb-28">
      
      {/* ========================================================================= */}
      {/* 1. HEADER DE IDENTIDAD SISMO LAB (AZUL MARINO Y CIAN)                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#061426] text-white border-b border-white/10 px-4 py-3 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brand-cyan" />
            <span>{es ? 'Inicio' : 'Home'}</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan block">
              SISMO LAB · PREPARACIÓN FAMILIAR
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              {es ? 'Mochila de Supervivencia 72h' : '72h Emergency Kit'}
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO EDITORIAL: FOTOGRAFÍA PROTAGONISTA & ESTADO DE PREPARACIÓN         */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#061426] via-[#0A1D33] to-[#0F2844] text-white px-4 pt-6 pb-8 border-b border-slate-200 shadow-sm relative overflow-hidden">
        {/* Glow de ambiente */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          
          {/* Fila principal: Imagen protagonista y datos esenciales */}
          <div className="flex items-center gap-5 sm:gap-7">
            {/* Fotografía protagonista de la mochila */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/5 border border-white/15 p-2 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <img
                  src="/images/kit/mochila.webp"
                  alt="Mochila de emergencia familiar"
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              {percentage === 100 && (
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-[#061426]">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Titular y ratio de completitud */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/25">
                  AUTONOMÍA 72 HORAS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 leading-tight">
                {es ? 'Mochila de Protección Familiar' : 'Family Survival Backpack'}
              </h1>
              
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-brand-cyan" />
                <span>
                  {es
                    ? `Insumos calculados para ${familyPlan.members.length} integrantes`
                    : `Calculated for ${familyPlan.members.length} members`}
                </span>
              </p>
            </div>
          </div>

          {/* Barra de progreso y estadísticas visuales */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-300 block">
                  {es ? 'Nivel de Protección' : 'Readiness Level'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                  {percentage}%
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-brand-cyan block">
                  {packedCount} {es ? 'de' : 'of'} {totalCount} {es ? 'preparados' : 'packed'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {missingCount === 0
                    ? es ? '¡Kit completo!' : 'Kit completed!'
                    : es ? `${missingCount} insumos pendientes` : `${missingCount} items pending`}
                </span>
              </div>
            </div>

            {/* Barra de progreso sobria y elegante */}
            <div className="w-full h-2.5 rounded-full bg-navy-950/80 border border-white/10 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  percentage === 100
                    ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                    : 'bg-gradient-to-r from-brand-cyan to-teal-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Acciones de la cabecera: Compartir y Agregar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{es ? 'Enviar lista de faltantes a la familia' : 'Share missing via WhatsApp'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowAddModal(true);
              }}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              title={es ? 'Agregar insumo' : 'Add item'}
            >
              <Plus className="w-4 h-4 text-brand-cyan" />
              <span>{es ? 'Agregar' : 'Add'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SUPERFICIE CLARA: CUADRÍCULA VISUAL DE CATEGORÍAS CON FOTOS REALES     */}
      {/* ========================================================================= */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Selector Visual de Categorías */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {es ? 'Categorías de Equipamiento' : 'Equipment Categories'}
            </h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory('all');
                }}
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800"
              >
                {es ? 'Ver todas' : 'View all'}
              </button>
            )}
          </div>

          {/* Grid visual con fotografías reales representativas */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {BACKPACK_CATEGORIES_META.map((cat) => {
              const catItems = items.filter((i) => i.category === cat.id);
              const catPacked = catItems.filter((i) => i.is_packed).length;
              const isSelected = selectedCategory === cat.id;
              const isComplete = catItems.length > 0 && catPacked === catItems.length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(isSelected ? 'all' : cat.id);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between h-28 overflow-hidden group ${
                    isSelected
                      ? 'bg-cyan-50/80 border-cyan-500 shadow-sm ring-2 ring-cyan-500/20'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Imagen fotográfica del kit */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100/80 p-1 flex items-center justify-center self-start">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Nombre y badge de completitud */}
                  <div>
                    <h3 className={`text-xs font-bold tracking-tight line-clamp-1 ${isSelected ? 'text-cyan-950 font-black' : 'text-slate-800'}`}>
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] font-mono text-slate-500 font-medium">
                        {catPacked}/{catItems.length}
                      </span>
                      {isComplete && (
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Filtros de estado secundarios (limpios y compactos) */}
        <section className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 pt-1">
          {[
            { id: 'all', label: es ? `Todos (${items.length})` : `All (${items.length})` },
            { id: 'missing', label: es ? `Pendientes (${missingCount})` : `Pending (${missingCount})` },
            { id: 'packed', label: es ? `Listos (${packedCount})` : `Packed (${packedCount})` },
            { id: 'perishable', label: es ? 'Control de Vencimiento' : 'Expiry Check' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                sound.playClick();
                setStatusFilter(f.id as any);
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* ========================================================================= */}
        {/* 4. LISTA COMPACTA DE INSUMOS (ESTILO MANUAL DE EQUIPO DE MONTAÑA / APPLE) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          <div className="p-3.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {selectedCategory === 'all'
                ? (es ? 'Lista de Insumos Esenciales' : 'Essential Supplies')
                : (BACKPACK_CATEGORIES_META.find(c => c.id === selectedCategory)?.name || selectedCategory)}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {filteredItems.length} {es ? 'elementos' : 'items'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const isExpanded = expandedItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-4 transition-colors ${
                    item.is_packed ? 'bg-white hover:bg-slate-50/60' : 'bg-slate-50/30 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    
                    {/* Botón de Checkbox táctil */}
                    <button
                      type="button"
                      onClick={() => toggleItemPacked(item.id)}
                      className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={item.is_packed ? 'Desmarcar' : 'Marcar como listo'}
                    >
                      {item.is_packed ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center bg-white" />
                      )}
                    </button>

                    {/* Miniatura de la fotografía del insumo */}
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={item.image || getItemFallbackImage(item.category)}
                        alt={item.name}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                        onError={(e) => {
                          // Fallback si la imagen no carga
                          (e.target as HTMLImageElement).src = '/images/kit/mochila.webp';
                        }}
                      />
                    </div>

                    {/* Detalles del insumo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className={`text-sm font-bold tracking-tight cursor-pointer ${
                            item.is_packed ? 'text-slate-800 line-through opacity-80' : 'text-slate-900'
                          }`}
                        >
                          {item.name}
                        </h4>

                        {/* Cantidad requerida destacada */}
                        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
                          {item.required_quantity} {item.unit}
                        </span>
                      </div>

                      {/* Explicación breve y control de vencimiento */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 line-clamp-1">
                          {item.description}
                        </span>

                        {item.is_perishable && (
                          <div className="shrink-0 flex items-center gap-2">
                            {getExpiryBadge(item.expiry_date)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botón expandir información adicional */}
                    <button
                      type="button"
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Detalle contextual expandible (solo cuando el usuario lo pide) */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 pl-14 pr-2 space-y-2 text-xs animate-in fade-in duration-150">
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {item.description}
                      </p>

                      {/* Ajuste de fecha de vencimiento si es perecedero */}
                      {item.is_perishable && (
                        <div className="flex items-center gap-3 pt-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{es ? 'Fecha de vencimiento:' : 'Expiry date:'}</span>
                          </label>
                          <input
                            type="date"
                            value={item.expiry_date || ''}
                            onChange={(e) => handleUpdateExpiry(item.id, e.target.value)}
                            className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-cyan-600"
                          />
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">
                  {es ? 'No hay insumos en esta selección' : 'No items found in this filter'}
                </p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 5. MODAL PARA AGREGAR INSUMO PERSONALIZADO                                */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 tracking-tight">
                {es ? 'Agregar Insumo a la Mochila' : 'Add Emergency Supply'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  {es ? 'Nombre del insumo' : 'Supply name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={es ? 'Ej: Medicamento crónico, anteojos, alimento canino' : 'e.g., Prescriptions, spare glasses'}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    {es ? 'Categoría' : 'Category'}
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as BackpackCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    {BACKPACK_CATEGORIES_META.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    {es ? 'Cantidad requerida' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  {es ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 shadow-md"
                >
                  {es ? 'Guardar' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
