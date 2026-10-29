import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Share2,
  Calendar,
  AlertTriangle,
  Plus,
  RefreshCw,
  Users,
  Check,
  ShoppingBag
} from 'lucide-react';
import { ScreenId } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  loadBackpackInventory,
  saveBackpackInventory,
  loadFamilyPlan,
  generateWhatsAppShoppingList,
} from '../../services/familyBackpackService';
import { BackpackItem, BackpackCategory } from '../../types';

interface BackpackPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const BackpackPage: React.FC<BackpackPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const es = language === 'es';

  const [familyPlan, setFamilyPlan] = useState(() => loadFamilyPlan());
  const [items, setItems] = useState<BackpackItem[]>(() =>
    loadBackpackInventory(familyPlan.members.length)
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'missing' | 'packed' | 'perishable'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState<BackpackCategory>('especiales');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    saveBackpackInventory(items);
  }, [items]);

  const totalCount = items.length;
  const packedCount = items.filter((i) => i.is_packed).length;
  const missingCount = totalCount - packedCount;
  const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

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
      description: 'Insumo personalizado agregado para la familia.',
      quantity: 1,
      required_quantity: parseInt(newItemQuantity, 10) || 1,
      unit: 'u.',
      is_packed: true,
      is_perishable: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setNewItemName('');
    setNewItemQuantity('1');
    setShowAddModal(false);
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'missing') return !item.is_packed;
    if (activeFilter === 'packed') return item.is_packed;
    if (activeFilter === 'perishable') return item.is_perishable;
    return true;
  });

  const getExpiryBadge = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const now = new Date().getTime();
    const expTime = new Date(expiryDate).getTime();
    const diffDays = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-red-300 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          {es ? 'VENCIDO' : 'EXPIRED'}
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          {es ? `Vence en ${diffDays}d` : `Expires in ${diffDays}d`}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold text-slate-400">
        Vence: {expiryDate}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950 relative pb-28">
      
      {/* Luces sutiles */}
      <div className="fixed top-0 right-1/4 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{es ? 'Inicio' : 'Home'}</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold font-mono block">
              SUPERVIVENCIA 72 HORAS
            </span>
            <span className="text-xs font-black text-white">
              Mochila de Emergencia
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-5">
        
        {/* Panel de Progreso y Cálculo de Familia */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-brand-cyan/25 shadow-card-navy space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-cyan block">
                {familyPlan.family_name.toUpperCase()}
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase mt-0.5">
                Estado de Preparación
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-brand-cyan" />
                <span>
                  {es
                    ? `Cantidades calculadas para ${familyPlan.members.length} integrantes`
                    : `Quantities calculated for ${familyPlan.members.length} members`}
                </span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-3xl font-black font-mono text-brand-cyan tabular-nums block">
                {percentage}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {packedCount} de {totalCount} listos
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-3 rounded-full bg-navy-950 border border-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-emerald-400 transition-all duration-500 shadow-glow-cyan"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Botones de acción rápida: Compartir por WhatsApp + Nuevo Insumo */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>{es ? 'Enviar faltantes por WhatsApp' : 'Share missing on WhatsApp'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowAddModal(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-navy-950 border border-white/15 hover:border-brand-cyan/50 text-slate-300 hover:text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
              title={es ? 'Agregar insumo' : 'Add item'}
            >
              <Plus className="w-4 h-4 text-brand-cyan" />
              <span className="hidden sm:inline">{es ? 'Agregar' : 'Add'}</span>
            </button>
          </div>
        </section>

        {/* Filtros */}
        <section className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: es ? `Todos (${totalCount})` : `All (${totalCount})` },
            { id: 'missing', label: es ? `Faltan (${missingCount})` : `Missing (${missingCount})` },
            { id: 'packed', label: es ? `Listos (${packedCount})` : `Packed (${packedCount})` },
            { id: 'perishable', label: es ? 'Perecederos / Botiquín' : 'Perishables' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                sound.playClick();
                setActiveFilter(f.id as any);
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan'
                  : 'bg-navy-900 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* Lista de Insumos */}
        <section className="space-y-2.5">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                  item.is_packed
                    ? 'bg-navy-900/60 border-emerald-500/30'
                    : 'bg-navy-900/90 border-white/10 hover:border-brand-gold/40'
                }`}
              >
                {/* Checkbox táctil */}
                <button
                  type="button"
                  onClick={() => toggleItemPacked(item.id)}
                  className="mt-0.5 shrink-0 text-slate-400 hover:text-white transition-colors"
                >
                  {item.is_packed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500 hover:text-brand-gold" />
                  )}
                </button>

                {/* Detalle */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-black text-sm tracking-tight leading-tight ${item.is_packed ? 'text-white' : 'text-slate-200'}`}>
                      {item.name}
                    </h3>
                    <span className="font-mono text-xs font-black text-brand-gold bg-brand-gold/10 border border-brand-gold/25 px-2 py-0.5 rounded-md shrink-0">
                      {item.required_quantity} {item.unit}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug">
                    {item.description}
                  </p>

                  {/* Estado de Vencimiento para perecederos */}
                  {item.is_perishable && (
                    <div className="pt-1.5 flex flex-wrap items-center gap-2">
                      {getExpiryBadge(item.expiry_date)}

                      <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1 cursor-pointer hover:text-brand-cyan">
                        <Calendar className="w-3 h-3" />
                        <input
                          type="date"
                          value={item.expiry_date || ''}
                          onChange={(e) => handleUpdateExpiry(item.id, e.target.value)}
                          className="bg-transparent border-b border-white/20 text-slate-300 text-[10px] focus:outline-none focus:border-brand-cyan"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>

      </main>

      {/* Modal para agregar insumo personalizado */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/20 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-black text-lg text-white uppercase tracking-tight">
              {es ? 'Agregar Insumo a la Mochila' : 'Add Custom Item'}
            </h3>

            <form onSubmit={handleAddNewItem} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {es ? 'Nombre del insumo' : 'Item name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={es ? 'Ej: Alimento para el perro, anteojos extra' : 'e.g., Pet food, spare glasses'}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-navy-950 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {es ? 'Cantidad requerida' : 'Required quantity'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="w-full bg-navy-950 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white"
                >
                  {es ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-brand-cyan text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-cyan-300"
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
