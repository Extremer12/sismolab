import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SISMO LAB application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="sismo-card p-6 max-w-sm w-full border-rose-500/40 bg-navy-900/90 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="font-black text-xl text-white uppercase tracking-tight">
                Algo no salió como esperábamos
              </h2>
              <p className="text-xs text-slate-300">
                Se detectó una interrupción temporal en la aplicación. Podés reiniciar para continuar con tu progreso guardado.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-2xl bg-brand-cyan hover:bg-brand-electric text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reiniciar Aplicación</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
