import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Shield,
  MapPin,
  PhoneCall,
  Share2,
  Copy,
  Check,
  Plus,
  Radio,
  Clock,
  HeartHandshake,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { ScreenId, EmergencyRole, MemberStatus, FamilyMember } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  loadFamilyPlan,
  saveFamilyPlan,
  ROLE_LABELS,
} from '../../services/familyBackpackService';

interface FamilyPlanPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const FamilyPlanPage: React.FC<FamilyPlanPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const es = language === 'es';

  const [plan, setPlan] = useState(() => loadFamilyPlan());
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<EmergencyRole>('asistir_vulnerables');
  const [isEditingMeetingPoints, setIsEditingMeetingPoints] = useState(false);

  // Estados temporales para edición de puntos
  const [primaryPoint, setPrimaryPoint] = useState(plan.meeting_point_primary);
  const [secondaryPoint, setSecondaryPoint] = useState(plan.meeting_point_secondary);
  const [contactName, setContactName] = useState(plan.out_of_province_contact.name);
  const [contactPhone, setContactPhone] = useState(plan.out_of_province_contact.phone);

  useEffect(() => {
    saveFamilyPlan(plan);
  }, [plan]);

  const handleCopyCode = () => {
    sound.playClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(plan.invite_code).catch(() => {});
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareInvite = () => {
    sound.playClick();
    const text = `👨‍👩‍👧 *PLAN FAMILIAR SISMO LAB (San Juan)*\nUnite a nuestro grupo familiar con este código: *${plan.invite_code}*\n\n📍 *Punto de encuentro:* ${plan.meeting_point_primary}\n📲 Descargá la app y coordinemos nuestro protocolo de emergencia.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleUpdateStatus = (memberId: string, status: MemberStatus) => {
    sound.playClick();
    setPlan((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status,
              status_updated_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : m
      ),
    }));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    sound.playClick();
    const newMember: FamilyMember = {
      id: 'member-' + Date.now(),
      name: newMemberName.trim(),
      relation: newMemberRelation.trim() || 'Familiar',
      is_dependent: false,
      role: newMemberRole,
      status: 'safe',
      status_updated_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPlan((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));

    setNewMemberName('');
    setNewMemberRelation('');
    setShowAddMemberModal(false);
  };

  const handleSavePoints = () => {
    sound.playClick();
    setPlan((prev) => ({
      ...prev,
      meeting_point_primary: primaryPoint,
      meeting_point_secondary: secondaryPoint,
      out_of_province_contact: {
        ...prev.out_of_province_contact,
        name: contactName,
        phone: contactPhone,
      },
    }));
    setIsEditingMeetingPoints(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950 relative pb-28">
      
      {/* Luces sutiles */}
      <div className="fixed top-0 left-1/4 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan font-mono block">
              DEFENSA CIVIL SAN JUAN
            </span>
            <span className="text-xs font-black text-white">
              Plan Familiar de Emergencia
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Tarjeta de Código y Grupo Familiar */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-brand-purple/30 shadow-card-navy space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-purple-300 block">
                GRUPO VINCULADO
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase mt-0.5">
                {plan.family_name}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {plan.members.length} {es ? 'integrantes registrados' : 'registered members'}
              </p>
            </div>

            {/* Código de familia */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="py-2 px-3.5 rounded-xl bg-navy-950 border border-brand-purple/40 font-mono text-sm font-black text-purple-300 tracking-wider">
                {plan.invite_code}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl border border-white/10 bg-navy-950 hover:border-brand-purple/50 text-slate-300 hover:text-white transition-all text-xs"
                title={es ? 'Copiar código' : 'Copy code'}
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShareInvite}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-transform active:scale-95"
                title={es ? 'Compartir por WhatsApp' : 'Share via WhatsApp'}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Sección: Integrantes y Roles de Emergencia */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-cyan" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
                {es ? 'Integrantes & Roles Tácticos' : 'Members & Tactical Roles'}
              </h2>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setShowAddMemberModal(true);
              }}
              className="text-xs font-bold text-brand-cyan hover:text-cyan-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{es ? 'Sumar integrante' : 'Add member'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {plan.members.map((member) => {
              const roleInfo = ROLE_LABELS[member.role] || ROLE_LABELS.asistir_vulnerables;
              const isSafe = member.status === 'safe';

              return (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl border border-white/10 bg-navy-900/90 space-y-3 transition-colors hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-white tracking-tight">
                          {member.name}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {member.relation}
                        </span>
                      </div>
                      <p className="text-xs text-brand-yellow font-bold mt-1">
                        🛡️ {roleInfo.title}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                        {roleInfo.desc}
                      </p>
                    </div>

                    {/* Badge de estado */}
                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isSafe
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-red-500/15 text-red-300 border-red-500/30'
                        }`}
                      >
                        {isSafe ? '✓ Seguro' : '⚠ Auxilio'}
                      </span>
                      {member.status_updated_at && (
                        <span className="text-[9px] font-mono text-slate-400 block mt-1">
                          {member.status_updated_at}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción táctica: "Estoy bien" / "Necesito ayuda" */}
                  <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(member.id, 'safe')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        isSafe
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                          : 'bg-navy-950 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{es ? 'Estoy seguro' : "I'm safe"}</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(member.id, 'need_help')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        !isSafe
                          ? 'bg-red-600 text-white font-black shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : 'bg-navy-950 text-slate-400 hover:text-red-400 border border-white/10'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>{es ? 'Pido auxilio' : 'Need help'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sección: Puntos de Encuentro y Evacuación */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
                {es ? 'Puntos de Encuentro Familiar' : 'Family Meeting Points'}
              </h2>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setIsEditingMeetingPoints(!isEditingMeetingPoints);
              }}
              className="text-xs font-bold text-brand-gold hover:text-yellow-300"
            >
              {isEditingMeetingPoints ? (es ? 'Guardar' : 'Save') : (es ? 'Editar' : 'Edit')}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-navy-900/90 border border-white/10 space-y-4">
            {/* Punto Primario */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-cyan block">
                PUNTO 01 · PRINCIPAL (CERCANO AL HOGAR)
              </span>
              {isEditingMeetingPoints ? (
                <input
                  type="text"
                  value={primaryPoint}
                  onChange={(e) => setPrimaryPoint(e.target.value)}
                  className="w-full bg-navy-950 border border-white/20 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                  placeholder="Ej: Plaza del barrio, esquina libre de cables"
                />
              ) : (
                <p className="text-xs font-bold text-white">
                  📍 {plan.meeting_point_primary}
                </p>
              )}
              <span className="text-[11px] text-slate-400 block">
                A 2 o 3 cuadras de la vivienda en zona abierta (libre de cables, árboles altos y marquesinas).
              </span>
            </div>

            {/* Punto Secundario */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-gold block">
                PUNTO 02 · ALTERNATIVO (EXTERIOR)
              </span>
              {isEditingMeetingPoints ? (
                <input
                  type="text"
                  value={secondaryPoint}
                  onChange={(e) => setSecondaryPoint(e.target.value)}
                  className="w-full bg-navy-950 border border-white/20 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: Parque de Mayo, polideportivo municipal"
                />
              ) : (
                <p className="text-xs font-bold text-white">
                  📍 {plan.meeting_point_secondary}
                </p>
              )}
              <span className="text-[11px] text-slate-400 block">
                Por si el acceso al barrio está interrumpido por anegamiento o crecida de badenes.
              </span>
            </div>

            {/* Contacto fuera de la provincia */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400 block">
                CONTACTO EXTERIOR (FUERA DE SAN JUAN)
              </span>
              {isEditingMeetingPoints ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nombre familiar"
                    className="bg-navy-950 border border-white/20 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Teléfono"
                    className="bg-navy-950 border border-white/20 rounded-xl p-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              ) : (
                <p className="text-xs font-bold text-white">
                  📞 {plan.out_of_province_contact.name || 'Sin asignar'} ·{' '}
                  <span className="font-mono text-emerald-300">
                    {plan.out_of_province_contact.phone || 'Completar número'}
                  </span>
                </p>
              )}
              <span className="text-[11px] text-slate-400 block">
                Recomendación oficial: cuando colapsan las antenas de San Juan, las llamadas de larga distancia se comunican con mayor éxito.
              </span>
            </div>

            {isEditingMeetingPoints && (
              <button
                onClick={handleSavePoints}
                className="w-full py-2.5 rounded-xl bg-brand-cyan text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-cyan-300"
              >
                Guardar Puntos de Encuentro
              </button>
            )}
          </div>
        </section>

        {/* Acceso a la Mochila Familiar */}
        <section className="pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('backpack');
            }}
            className="w-full p-4 rounded-2xl bg-navy-900 border border-brand-cyan/40 hover:border-brand-cyan flex items-center justify-between text-left active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white group-hover:text-brand-cyan transition-colors">
                  {es ? 'Mochila de Emergencia 72h' : '72h Emergency Backpack'}
                </h3>
                <p className="text-xs text-slate-300">
                  {es ? 'Revisar inventario y fechas de vencimiento' : 'Check inventory and expiry dates'}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
          </button>
        </section>

      </main>

      {/* Modal para agregar integrante */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/20 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-black text-lg text-white uppercase tracking-tight">
              {es ? 'Sumar Integrante a la Familia' : 'Add Family Member'}
            </h3>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mateo, Lucía, Abuela Rosa"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-navy-950 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Parentesco / Rol en el hogar
                </label>
                <input
                  type="text"
                  placeholder="Ej: Hijo, Pareja, Abuelo"
                  value={newMemberRelation}
                  onChange={(e) => setNewMemberRelation(e.target.value)}
                  className="w-full bg-navy-950 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Rol de Emergencia Asignado
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as EmergencyRole)}
                  className="w-full bg-navy-950 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan"
                >
                  <option value="cortar_suministros">Cortar gas y luz</option>
                  <option value="llevar_mochila">Tomar la mochila 72h</option>
                  <option value="asistir_vulnerables">Asistir a niños/mayores/mascotas</option>
                  <option value="coordinador">Líder de evacuación</option>
                  <option value="comunicacion">Comunicación con exterior</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="py-2 px-4 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-brand-cyan text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-cyan-300"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
