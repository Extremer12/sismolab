import React, { useState, useEffect, useMemo } from 'react';
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
  ExternalLink,
  Navigation,
  Compass,
  Edit3,
  X,
  Phone,
  MessageCircle,
  Flame,
  Zap,
  Trash2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ScreenId, EmergencyRole, MemberStatus, FamilyMember, FamilyPlan } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import {
  loadFamilyPlan,
  saveFamilyPlan,
  ROLE_LABELS,
} from '../../services/familyBackpackService';

interface FamilyPlanPageProps {
  onNavigate: (screen: ScreenId) => void;
}

// Helper to recenter map
const RecenterMap: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

// Available avatars in the public directory
const AVAILABLE_AVATARS = Array.from({ length: 12 }, (_, i) => `/images/avatar/avatar_${i + 1}.webp`);

export const FamilyPlanPage: React.FC<FamilyPlanPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const es = language === 'es';

  const [plan, setPlan] = useState<FamilyPlan>(() => loadFamilyPlan());
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditPointsModal, setShowEditPointsModal] = useState(false);
  const [activeMapTab, setActiveMapTab] = useState<'primary' | 'secondary' | 'home'>('primary');

  // Form states for new member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<EmergencyRole>('asistir_vulnerables');
  const [newMemberAvatar, setNewMemberAvatar] = useState('/images/avatar/avatar_1.webp');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  // Form states for editing meeting points
  const [primaryName, setPrimaryName] = useState(plan.meeting_point_primary);
  const [secondaryName, setSecondaryName] = useState(plan.meeting_point_secondary);
  const [contactName, setContactName] = useState(plan.out_of_province_contact.name);
  const [contactPhone, setContactPhone] = useState(plan.out_of_province_contact.phone);
  const [contactCity, setContactCity] = useState(plan.out_of_province_contact.city || 'Mendoza / Córdoba');

  // Default coordinates fallback (San Juan Center)
  const homeCoords: [number, number] = plan.home_coords || [-31.5350, -68.5320];
  const primaryCoords: [number, number] = plan.meeting_point_primary_coords || [-31.5375, -68.5364];
  const secondaryCoords: [number, number] = plan.meeting_point_secondary_coords || [-31.5303, -68.5418];

  useEffect(() => {
    saveFamilyPlan(plan);
  }, [plan]);

  // Active center based on tab
  const mapCenter = useMemo<[number, number]>(() => {
    if (activeMapTab === 'primary') return primaryCoords;
    if (activeMapTab === 'secondary') return secondaryCoords;
    return homeCoords;
  }, [activeMapTab, primaryCoords, secondaryCoords, homeCoords]);

  // Leaflet custom DivIcons
  const primaryPin = useMemo(() => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
          <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#10B981;border:3px solid #FFFFFF;border-radius:50%;box-shadow:0 6px 16px rgba(16,185,129,0.55);color:white;font-weight:900;font-size:13px;font-family:sans-serif;">
            1
          </div>
          <div style="background:#061426;color:#34D399;font-size:9px;font-weight:800;letter-spacing:0.5px;padding:2px 6px;border-radius:6px;margin-top:2px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.4);border:1px solid rgba(52,211,153,0.3);">
            PRINCIPAL
          </div>
        </div>
      `,
      iconSize: [80, 56],
      iconAnchor: [40, 18],
    });
  }, []);

  const secondaryPin = useMemo(() => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
          <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#0284C7;border:3px solid #FFFFFF;border-radius:50%;box-shadow:0 6px 16px rgba(2,132,199,0.55);color:white;font-weight:900;font-size:13px;font-family:sans-serif;">
            2
          </div>
          <div style="background:#061426;color:#38BDF8;font-size:9px;font-weight:800;letter-spacing:0.5px;padding:2px 6px;border-radius:6px;margin-top:2px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.4);border:1px solid rgba(56,189,248,0.3);">
            ALTERNO
          </div>
        </div>
      `,
      iconSize: [80, 56],
      iconAnchor: [40, 18],
    });
  }, []);

  const homePin = useMemo(() => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
          <div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;background:#0F172A;border:2.5px solid #20D9F5;border-radius:50%;box-shadow:0 6px 16px rgba(32,217,245,0.4);color:#20D9F5;font-weight:900;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div style="background:#061426;color:#E2E8F0;font-size:9px;font-weight:800;letter-spacing:0.5px;padding:2px 6px;border-radius:6px;margin-top:2px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.2);">
            HOGAR
          </div>
        </div>
      `,
      iconSize: [80, 56],
      iconAnchor: [40, 17],
    });
  }, []);

  // Actions
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
    const text = `👨‍👩‍👧 *PLAN FAMILIAR SISMO LAB (San Juan)*\nUnite a nuestro grupo familiar con este código: *${plan.invite_code}*\n\n📍 *Punto de encuentro principal:* ${plan.meeting_point_primary}\n📲 Descargá la app y coordinemos nuestro protocolo de emergencia.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareMeetingPoint = () => {
    sound.playClick();
    const text = `📍 *PUNTOS DE ENCUENTRO FAMILIA ${plan.family_name.toUpperCase()}*\n\n1️⃣ *Punto Principal:* ${plan.meeting_point_primary}\nUbicación GPS: https://maps.google.com/?q=${primaryCoords[0]},${primaryCoords[1]}\n\n2️⃣ *Punto Secundario:* ${plan.meeting_point_secondary}\nUbicación GPS: https://maps.google.com/?q=${secondaryCoords[0]},${secondaryCoords[1]}\n\n📞 *Contacto de Emergencia fuera de San Juan:* ${plan.out_of_province_contact.name} (${plan.out_of_province_contact.phone})\n\n_Generado con SISMO LAB (San Juan)_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleUpdateStatus = (memberId: string, status: MemberStatus) => {
    sound.playClick();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPlan((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status,
              status_updated_at: nowTime,
            }
          : m
      ),
    }));

    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember((prev) => (prev ? { ...prev, status, status_updated_at: nowTime } : null));
    }
  };

  const handleUpdateRole = (memberId: string, role: EmergencyRole) => {
    sound.playClick();
    setPlan((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
    }));
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember((prev) => (prev ? { ...prev, role } : null));
    }
  };

  const handleUpdateAvatar = (memberId: string, avatar: string) => {
    sound.playClick();
    setPlan((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, avatar } : m)),
    }));
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember((prev) => (prev ? { ...prev, avatar } : null));
    }
  };

  const handleRemoveMember = (memberId: string) => {
    sound.playClick();
    if (plan.members.length <= 1) return;
    setPlan((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
    setSelectedMember(null);
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
      avatar: newMemberAvatar,
      phone: newMemberPhone.trim() || undefined,
    };

    setPlan((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));

    setNewMemberName('');
    setNewMemberRelation('');
    setNewMemberPhone('');
    setShowAddMemberModal(false);
  };

  const handleSaveMeetingPoints = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setPlan((prev) => ({
      ...prev,
      meeting_point_primary: primaryName.trim() || prev.meeting_point_primary,
      meeting_point_secondary: secondaryName.trim() || prev.meeting_point_secondary,
      out_of_province_contact: {
        name: contactName.trim() || prev.out_of_province_contact.name,
        phone: contactPhone.trim() || prev.out_of_province_contact.phone,
        city: contactCity.trim() || prev.out_of_province_contact.city,
      },
    }));
    setShowEditPointsModal(false);
  };

  const safeCount = plan.members.filter((m) => m.status === 'safe').length;
  const needHelpCount = plan.members.filter((m) => m.status === 'need_help').length;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950 pb-28 transition-colors duration-200 ${
        isDark ? 'bg-[#061426] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. HEADER DE IDENTIDAD SISMO LAB                                          */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-30 px-4 py-3 border-b transition-colors ${
          isDark
            ? 'bg-[#061426]/95 border-white/10 text-white backdrop-blur-md'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm backdrop-blur-md'
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className={`flex items-center gap-2 text-xs font-semibold tracking-wider transition-colors ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-brand-cyan" />
            <span>{es ? 'Inicio' : 'Home'}</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan block">
              DEFENSA CIVIL SAN JUAN
            </span>
            <span className={`text-xs font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {es ? 'Plan Familiar de Emergencia' : 'Family Emergency Plan'}
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO: LA FAMILIA COMO UNIDAD (COLECTIVA, ELEGANTE Y COMPACTA)           */}
      {/* ========================================================================= */}
      <section
        className={`px-4 pt-6 pb-7 border-b relative overflow-hidden shadow-sm transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-[#061426] via-[#0A1D33] to-[#0D2235] text-white border-white/10'
            : 'bg-gradient-to-b from-[#0D2235] via-[#102A45] to-[#153455] text-white border-slate-200'
        }`}
      >
        {/* Glow de ambiente */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          
          {/* Fila de nombre familiar y código */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                  GRUPO FAMILIAR VINCULADO
                </span>
                {needHelpCount > 0 ? (
                  <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    {needHelpCount} {es ? 'auxilio solicitado' : 'needs help'}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {es ? 'Todos a salvo' : 'All safe'}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-1 leading-tight">
                {plan.family_name}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {plan.members.length} {es ? 'integrantes coordinados' : 'connected members'}
              </p>
            </div>

            {/* Código de enlace familiar */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <span className="font-mono text-xs font-black text-brand-cyan px-2 tracking-wider">
                {plan.invite_code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs"
                title={es ? 'Copiar código' : 'Copy code'}
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleShareInvite}
                className="p-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                title={es ? 'Compartir por WhatsApp' : 'Share via WhatsApp'}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{es ? 'Invitar' : 'Invite'}</span>
              </button>
            </div>
          </div>

          {/* CLUSTER FAMILIAR VISUAL (Cercanía, sin tarjetas gigantescas por persona) */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{es ? 'Integrantes de la Familia' : 'Family Members'}</span>
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddMemberModal(true);
                }}
                className="text-xs font-bold text-brand-cyan hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{es ? 'Sumar integrante' : 'Add member'}</span>
              </button>
            </div>

            {/* Roster de integrantes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {plan.members.map((member) => {
                const isSafe = member.status === 'safe';
                const roleInfo = ROLE_LABELS[member.role] || ROLE_LABELS.asistir_vulnerables;

                return (
                  <button
                    key={member.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedMember(member);
                    }}
                    className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Avatar con anillo de estado de seguridad */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-11 h-11 rounded-full p-0.5 border-2 transition-all ${
                            isSafe ? 'border-emerald-400' : 'border-rose-500 animate-pulse'
                          }`}
                        >
                          <img
                            src={member.avatar || '/images/avatar/avatar_1.webp'}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover bg-navy-950"
                          />
                        </div>
                        {/* Dot de estado */}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#061426] ${
                            isSafe ? 'bg-emerald-400' : 'bg-rose-500'
                          }`}
                        />
                      </div>

                      {/* Nombre y parentesco */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xs text-white truncate leading-tight group-hover:text-brand-cyan transition-colors">
                          {member.name}
                        </h3>
                        <span className="text-[10px] text-slate-300 truncate block">
                          {member.relation}
                        </span>
                      </div>
                    </div>

                    {/* Rol táctico en pastilla compacta */}
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-medium text-slate-300 line-clamp-1 block leading-tight">
                        {roleInfo.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
              {es
                ? 'Tocá a cualquier integrante para gestionar su rol o estado de seguridad'
                : 'Tap any member to view tactical role or change safety status'}
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECCIÓN CARTOGRÁFICA PROTAGONISTA: PUNTOS DE ENCUENTRO (MAPA LEAFLET) */}
      {/* ========================================================================= */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-cyan" />
              <h2 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {es ? 'Puntos de Encuentro Cartográficos' : 'Cartographic Meeting Points'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowEditPointsModal(true);
                }}
                className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{es ? 'Editar referencias' : 'Edit locations'}</span>
              </button>
            </div>
          </div>

          {/* Pestañas de enfoque rápido */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => {
                sound.playClick();
                setActiveMapTab('primary');
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMapTab === 'primary'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-navy-900/90 text-slate-300 hover:text-white border border-white/10'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>{es ? 'Punto 01 · Principal' : 'Point 01 · Primary'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveMapTab('secondary');
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMapTab === 'secondary'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-navy-900/90 text-slate-300 hover:text-white border border-white/10'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-300" />
              <span>{es ? 'Punto 02 · Alterno' : 'Point 02 · Secondary'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveMapTab('home');
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMapTab === 'home'
                  ? isDark ? 'bg-brand-cyan text-navy-950 font-black shadow-glow-cyan/30' : 'bg-slate-900 text-white shadow-sm'
                  : isDark
                  ? 'bg-navy-900/90 text-slate-300 hover:text-white border border-white/10'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{es ? 'Hogar Familiar' : 'Home Base'}</span>
            </button>
          </div>

          {/* CONTENEDOR DEL MAPA LEAFLET */}
          <div
            className={`relative rounded-3xl overflow-hidden border shadow-md h-[340px] sm:h-[400px] ${
              isDark ? 'border-white/10 bg-[#061426]' : 'border-slate-300 bg-slate-100'
            }`}
          >
            <MapContainer
              center={mapCenter}
              zoom={15}
              className="w-full h-full"
              style={{ background: isDark ? '#061426' : '#E2E8F0' }}
              zoomControl={false}
              attributionControl={false}
            >
              {/* Capa de Carto / OpenStreetMap conmutable por modo */}
              <TileLayer
                url={
                  isDark
                    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                }
                maxZoom={16}
              />
              {isDark && (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={16}
                />
              )}

              <RecenterMap center={mapCenter} zoom={15} />

              {/* Ruta sugerida de evacuación desde el hogar al punto principal */}
              <Polyline
                positions={[homeCoords, primaryCoords]}
                pathOptions={{
                  color: '#20D9F5',
                  weight: 3.5,
                  dashArray: '8, 8',
                  opacity: 0.85,
                }}
              />

              {/* Marcador Hogar */}
              <Marker
                position={homeCoords}
                icon={homePin}
                eventHandlers={{
                  click: () => setActiveMapTab('home'),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="text-xs p-1 font-sans">
                    <p className="font-bold text-slate-900">Vivienda Familiar</p>
                    <p className="text-[11px] text-slate-600">Punto de partida de la evacuación</p>
                  </div>
                </Popup>
              </Marker>

              {/* Marcador Punto Principal */}
              <Marker
                position={primaryCoords}
                icon={primaryPin}
                eventHandlers={{
                  click: () => setActiveMapTab('primary'),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="text-xs p-1 font-sans">
                    <p className="font-bold text-emerald-800">Punto 01 · Principal</p>
                    <p className="text-[11px] text-slate-700">{plan.meeting_point_primary}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Marcador Punto Secundario */}
              <Marker
                position={secondaryCoords}
                icon={secondaryPin}
                eventHandlers={{
                  click: () => setActiveMapTab('secondary'),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="text-xs p-1 font-sans">
                    <p className="font-bold text-sky-800">Punto 02 · Alternativo</p>
                    <p className="text-[11px] text-slate-700">{plan.meeting_point_secondary}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* Badge flotante de San Juan */}
            <div className="absolute top-3 left-3 z-[400] bg-navy-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold tracking-wider border border-white/10 shadow-lg">
              SAN JUAN · SISTEMA CARTOGRÁFICO
            </div>
          </div>

          {/* FICHA CONTEXTUAL DEL PUNTO SELECCIONADO */}
          <div
            className={`rounded-2xl border p-4 shadow-sm space-y-3 transition-colors ${
              isDark ? 'bg-navy-900/90 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            {activeMapTab === 'primary' && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                    PUNTO 01 · REUNIÓN INMEDIATA
                  </span>
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    2 a 3 cuadras
                  </span>
                </div>
                <h3 className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {plan.meeting_point_primary}
                </h3>
                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {es
                    ? 'Zona abierta y despejada. Libre de cableado aéreo, árboles añejos o vidrieras altas. Todo integrante que esté en casa o en inmediaciones debe dirigirse aquí en los primeros 15 minutos.'
                    : 'Open clearing free of powerlines and masonry. Rendezvous within the first 15 minutes.'}
                </p>
              </div>
            )}

            {activeMapTab === 'secondary' && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-500 bg-sky-500/15 px-2 py-0.5 rounded border border-sky-500/30">
                    PUNTO 02 · ALTERNATIVO EXTERIOR
                  </span>
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    Zona Regional
                  </span>
                </div>
                <h3 className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {plan.meeting_point_secondary}
                </h3>
                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {es
                    ? 'Punto de repliegue si el barrio sufre anegamiento, caída masiva de tendido eléctrico o corte de accesos principales. Espacio verde amplio o polideportivo municipal.'
                    : 'Secondary assembly area if the neighborhood is inaccessible.'}
                </p>
              </div>
            )}

            {activeMapTab === 'home' && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/30">
                  HOGAR FAMILIAR · PUNTO CERO
                </span>
                <h3 className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Vivienda Familiar (San Juan)
                </h3>
                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {es
                    ? 'Al producirse el sismo: Agacharse, Cubrirse y Sujetarse. Luego de finalizado el movimiento, cortar suministros de gas y luz, retirar la mochila 72h junto a la puerta y evacuar caminando hacia el Punto 01.'
                    : 'Drop, Cover and Hold On. Shut off gas and electricity, grab the emergency backpack and evacuate.'}
                </p>
              </div>
            )}

            {/* Botón táctico para compartir coordenadas por WhatsApp */}
            <div className={`pt-2 border-t flex items-center justify-between gap-3 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {es ? 'Coordiná con toda la familia antes de cualquier evento:' : 'Coordinate coordinates with your family:'}
              </span>
              <button
                onClick={handleShareMeetingPoint}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0 shadow-sm ${
                  isDark
                    ? 'bg-brand-cyan text-navy-950 hover:bg-cyan-300'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{es ? 'Enviar puntos por WhatsApp' : 'Share on WhatsApp'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CONTACTO DE EMERGENCIA FUERA DE SAN JUAN                               */}
        {/* ========================================================================= */}
        <section
          className={`rounded-2xl border p-4 shadow-sm space-y-3 transition-colors ${
            isDark ? 'bg-navy-900/90 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              <span>{es ? 'Contacto Fuera de la Provincia' : 'Out-of-Province Contact'}</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {plan.out_of_province_contact.city || 'Mendoza / Córdoba'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {plan.out_of_province_contact.name || (es ? 'Familiar sin asignar' : 'Unassigned')}
              </h4>
              <p className={`text-xs font-mono font-bold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {plan.out_of_province_contact.phone || (es ? 'Sin número cargado' : 'No phone number')}
              </p>
            </div>

            {plan.out_of_province_contact.phone && (
              <a
                href={`tel:${plan.out_of_province_contact.phone}`}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 text-xs font-bold transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{es ? 'Llamar' : 'Call'}</span>
              </a>
            )}
          </div>

          <p className={`text-[11px] leading-normal font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {es
              ? 'Recomendación de Protección Civil: cuando las antenas telefónicas de San Juan colapsan por saturación local, las comunicaciones de larga distancia hacia otras provincias tienen prioridad y mayor probabilidad de conexión.'
              : 'Civil Defense rule: Out-of-province long-distance lines succeed when local networks jam.'}
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 5. VÍNCULO DIRECTO CON LA MOCHILA DE EMERGENCIA 72H                       */}
        {/* ========================================================================= */}
        <section>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('backpack');
            }}
            className={`w-full p-4 rounded-2xl border shadow-sm flex items-center justify-between text-left active:scale-[0.99] transition-all group ${
              isDark
                ? 'bg-navy-900/90 border-white/10 hover:border-brand-cyan/50 text-white'
                : 'bg-white border-slate-200 hover:border-cyan-600 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl border p-1 flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-navy-950 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <img
                  src="/images/kit/mochila.webp"
                  alt="Mochila"
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm group-hover:text-brand-cyan transition-colors">
                  {es ? 'Mochila de Protección Familiar 72h' : '72h Family Emergency Kit'}
                </h4>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {es ? 'Revisar equipamiento, agua, alimentos y botiquín' : 'Check equipment, water and rations'}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
          </button>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 6. DRAWER / SHEET CONTEXTUAL DE DETALLE DEL INTEGRANTE                     */}
      {/* ========================================================================= */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className={`rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 border max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-navy-900 border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header del modal */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedMember.avatar || '/images/avatar/avatar_1.webp'}
                  alt={selectedMember.name}
                  className={`w-14 h-14 rounded-full object-cover border-2 shadow-sm ${
                    isDark ? 'bg-navy-950 border-white/20' : 'bg-slate-100 border-slate-200'
                  }`}
                />
                <div>
                  <h3 className="font-black text-lg leading-tight">
                    {selectedMember.name}
                  </h3>
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {selectedMember.relation}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className={`p-1 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector de Avatar */}
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {es ? 'Cambiar fotografía / avatar:' : 'Change avatar portrait:'}
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {AVAILABLE_AVATARS.map((avUrl) => (
                  <button
                    key={avUrl}
                    type="button"
                    onClick={() => handleUpdateAvatar(selectedMember.id, avUrl)}
                    className={`w-9 h-9 rounded-full shrink-0 p-0.5 border-2 transition-all ${
                      selectedMember.avatar === avUrl ? 'border-brand-cyan scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={avUrl} alt="Avatar option" className="w-full h-full rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Estado de Seguridad Inmediato */}
            <div className={`p-3.5 rounded-2xl border space-y-2 ${isDark ? 'bg-navy-950/70 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {es ? 'Estado de Seguridad Actual' : 'Current Safety Status'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMember.id, 'safe')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedMember.status === 'safe'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-navy-900 text-slate-300 border border-white/10 hover:text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{es ? 'Estoy a salvo' : "I'm safe"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMember.id, 'need_help')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedMember.status === 'need_help'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-navy-900 text-slate-300 border border-white/10 hover:text-rose-400'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{es ? 'Pido auxilio' : 'Need help'}</span>
                </button>
              </div>

              {selectedMember.status_updated_at && (
                <span className="text-[10px] font-mono text-slate-400 block text-right">
                  {es ? 'Reportado a las' : 'Reported at'}: {selectedMember.status_updated_at}
                </span>
              )}
            </div>

            {/* Asignación del Rol Táctico de Emergencia */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {es ? 'Misión de Emergencia Asignada' : 'Assigned Emergency Mission'}
              </label>

              <select
                value={selectedMember.role}
                onChange={(e) => handleUpdateRole(selectedMember.id, e.target.value as EmergencyRole)}
                className={`w-full rounded-xl p-2.5 text-xs font-bold focus:outline-none border ${
                  isDark
                    ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                }`}
              >
                <option value="cortar_suministros" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Cortar suministros (Gas y Luz)</option>
                <option value="llevar_mochila" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Tomar la mochila 72h junto a la puerta</option>
                <option value="asistir_vulnerables" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Asistir a niños, mayores o mascotas</option>
                <option value="coordinador" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Líder de ruta y conteo en punto seguro</option>
                <option value="comunicacion" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Reportar estado al contacto de otra provincia</option>
              </select>

              {/* Explicación de la consigna oficial */}
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed font-medium ${
                  isDark ? 'bg-navy-950/60 border-white/10 text-slate-300' : 'bg-slate-100/70 border-slate-200 text-slate-700'
                }`}
              >
                {ROLE_LABELS[selectedMember.role]?.desc}
              </div>
            </div>

            {/* Acciones de contacto telefónico / eliminación */}
            <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {selectedMember.phone ? (
                <a
                  href={`tel:${selectedMember.phone}`}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    isDark ? 'bg-navy-950 text-slate-200 border border-white/10 hover:border-brand-cyan' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedMember.phone}</span>
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  {es ? 'Sin teléfono cargado' : 'No phone set'}
                </span>
              )}

              {plan.members.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(selectedMember.id)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 p-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{es ? 'Eliminar integrante' : 'Remove'}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL PARA SUMAR INTEGRANTE                                            */}
      {/* ========================================================================= */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 border ${
              isDark ? 'bg-navy-900 border-white/15 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base tracking-tight">
                {es ? 'Sumar Integrante a la Familia' : 'Add Family Member'}
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className={`p-1 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lucía, Mateo, Abuela Clara"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className={`w-full rounded-xl p-3 text-xs placeholder:text-slate-400 focus:outline-none border ${
                    isDark
                      ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600 focus:bg-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Parentesco
                  </label>
                  <input
                    type="text"
                    placeholder="Hijo, Pareja, etc."
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    className={`w-full rounded-xl p-2.5 text-xs focus:outline-none border ${
                      isDark
                        ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="264 4..."
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className={`w-full rounded-xl p-2.5 text-xs font-mono focus:outline-none border ${
                      isDark
                        ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Rol Táctico de Emergencia
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as EmergencyRole)}
                  className={`w-full rounded-xl p-2.5 text-xs focus:outline-none border ${
                    isDark
                      ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                  }`}
                >
                  <option value="cortar_suministros" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Cortar gas y disyuntor de luz</option>
                  <option value="llevar_mochila" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Tomar la mochila 72h</option>
                  <option value="asistir_vulnerables" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Asistir a niños, mayores o mascotas</option>
                  <option value="coordinador" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Líder de evacuación y recuento</option>
                  <option value="comunicacion" className={isDark ? 'bg-navy-950 text-white' : 'bg-white text-slate-900'}>Comunicación con exterior</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all ${
                    isDark
                      ? 'bg-brand-cyan text-navy-950 hover:bg-cyan-300'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL PARA EDITAR REFERENCIAS DE PUNTOS DE ENCUENTRO                   */}
      {/* ========================================================================= */}
      {showEditPointsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 border max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-navy-900 border-white/15 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base tracking-tight">
                {es ? 'Editar Puntos de Encuentro' : 'Edit Meeting Points'}
              </h3>
              <button
                onClick={() => setShowEditPointsModal(false)}
                className={`p-1 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeetingPoints} className="space-y-3.5">
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Punto 01 · Principal (A 2 o 3 cuadras)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Plaza 25 de Mayo (Mitre y Mendoza)"
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  className={`w-full rounded-xl p-2.5 text-xs focus:outline-none border ${
                    isDark
                      ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Punto 02 · Alternativo Exterior
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Parque de Mayo (Monumento al Deporte)"
                  value={secondaryName}
                  onChange={(e) => setSecondaryName(e.target.value)}
                  className={`w-full rounded-xl p-2.5 text-xs focus:outline-none border ${
                    isDark
                      ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600 focus:bg-white'
                  }`}
                />
              </div>

              <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Contacto de Referencia (Fuera de San Juan)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre familiar"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={`rounded-xl p-2.5 text-xs focus:outline-none border ${
                      isDark
                        ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Provincia / Ciudad"
                    value={contactCity}
                    onChange={(e) => setContactCity(e.target.value)}
                    className={`rounded-xl p-2.5 text-xs focus:outline-none border ${
                      isDark
                        ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>

                <input
                  type="tel"
                  placeholder="Teléfono con código de área (ej: 261 4...)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={`w-full rounded-xl p-2.5 text-xs font-mono focus:outline-none border ${
                    isDark
                      ? 'bg-navy-950 border-white/20 text-white focus:border-brand-cyan'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditPointsModal(false)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all ${
                    isDark
                      ? 'bg-brand-cyan text-navy-950 hover:bg-cyan-300'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
