import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { employeeService } from '../../services/employees';
import { formatCurrency } from '../../utils/format';
import { Sliders, CheckCircle, AlertCircle, FileSpreadsheet, Lock, TrendingUp, Minus, Plus, Search, ArrowRight } from 'lucide-react';

// ─── Numeric Stepper Component ────────────────────────────────────────────────
const NumericStepper = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  disabled: boolean;
}) => {
  const [inputStr, setInputStr] = useState(value.toFixed(2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputStr(value.toFixed(2));
  }, [value]);

  const validate = (v: number): string | null => {
    if (isNaN(v)) return 'Must be a number';
    if (v < 0) return 'Cannot be negative';
    if (v > 50) return 'Max 50% allowed';
    return null;
  };

  const commit = (raw: string) => {
    const v = parseFloat(raw);
    const err = validate(v);
    setError(err);
    if (!err) onChange(parseFloat(v.toFixed(2)));
  };

  const step = (delta: number) => {
    const next = parseFloat((value + delta).toFixed(2));
    const err = validate(next);
    setError(err);
    if (!err) onChange(next);
  };

  return (
    <div className="space-y-1">
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${error ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
        <span className="text-xs font-semibold text-slate-700 w-36 leading-tight">{label}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-0.5)}
            disabled={disabled || value <= 0}
            className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-sm"
          >
            <Minus size={12} />
          </button>
          <div className="relative w-20">
            <input
              type="number"
              value={inputStr}
              disabled={disabled}
              onChange={(e) => setInputStr(e.target.value)}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commit(inputStr)}
              className={`w-full text-center font-mono font-semibold text-sm bg-white border rounded-md py-1 pr-5 focus:outline-none focus:ring-1 disabled:bg-slate-50 transition-colors ${
                error ? 'border-red-400 text-red-700 focus:ring-red-300' : 'border-slate-300 text-indigo-700 focus:ring-indigo-400 focus:border-indigo-400'
              }`}
              min="0"
              max="50"
              step="0.5"
            />
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
          </div>
          <button
            type="button"
            onClick={() => step(0.5)}
            disabled={disabled || value >= 50}
            className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-sm"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      {error && <p className="text-[10px] font-medium text-red-600 pl-3">{error}</p>}
    </div>
  );
};

// ─── Component Row: Current → Projected with delta ──────────────────────────
const CompRow = ({
  label,
  current,
  projected,
  pct,
  isConstant = false,
}: {
  label: string;
  current: number;
  projected: number;
  pct?: number;
  isConstant?: boolean;
}) => {
  const diff = projected - current;
  const hasDiff = Math.abs(diff) > 0.5;

  return (
    <div className="grid grid-cols-[130px_1fr_32px_1fr] items-center gap-2 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <span className="text-xs font-mono text-slate-700 text-right">{formatCurrency(current)}</span>
      <ArrowRight size={12} className="text-slate-300 mx-auto" />
      <div className="flex items-center justify-end gap-2">
        <span className={`text-xs font-bold font-mono ${hasDiff ? 'text-indigo-800' : 'text-slate-700'}`}>
          {formatCurrency(projected)}
        </span>
        {hasDiff && (
          <span className="text-[9px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded whitespace-nowrap">
            +{pct !== undefined ? `${pct.toFixed(1)}%` : formatCurrency(diff)}
          </span>
        )}
        {isConstant && (
          <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Fixed</span>
        )}
      </div>
    </div>
  );
};

// ─── Status badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Submitted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'Not Started': 'bg-slate-50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg[status] ?? cfg['Not Started']}`}>
      {status}
    </span>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const PlanningPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [search, setSearch] = useState('');

  const [fixedPct, setFixedPct] = useState<number>(0);
  const [variablePct, setVariablePct] = useState<number>(0);
  const [retentionPct, setRetentionPct] = useState<number>(0);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 1. Fetch employee list
  const employeesQuery = useQuery({
    queryKey: ['planning-employees-list'],
    queryFn: () => employeeService.getEmployees({ page: 1, limit: 200 }),
  });

  // Auto-select first employee
  useEffect(() => {
    const items = employeesQuery.data?.items;
    if (items && items.length > 0 && !selectedEmpId) {
      setSelectedEmpId(items[0].id);
    }
  }, [employeesQuery.data, selectedEmpId]);

  // 2. Fetch current salary for selected employee
  const currentSalaryQuery = useQuery({
    queryKey: ['planning-current-salary', selectedEmpId],
    queryFn: () => employeeService.getEmployeeCurrentSalary(selectedEmpId),
    enabled: !!selectedEmpId,
  });

  // Reset on employee switch
  useEffect(() => {
    if (selectedEmpId) {
      setFixedPct(0);
      setVariablePct(0);
      setRetentionPct(0);
      setMessage(null);
      setHasUnsavedChanges(false);
    }
  }, [selectedEmpId]);

  // Track dirty state
  useEffect(() => {
    setHasUnsavedChanges(fixedPct !== 0 || variablePct !== 0 || retentionPct !== 0);
  }, [fixedPct, variablePct, retentionPct]);

  // Warn on browser navigation
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (p: { employee_id: string; fixed: number; variable: number; retention: number }) =>
      employeeService.savePlanning({
        employee_id: p.employee_id,
        increment_pct_fixed: p.fixed,
        increment_pct_variable: p.variable,
        increment_pct_retention: p.retention,
      }),
    onSuccess: (res) => {
      setMessage({ type: 'success', text: res.message });
      setHasUnsavedChanges(false);
      employeesQuery.refetch();
    },
    onError: (err: any) => {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to save draft.' });
    },
  });

  const submitMutation = useMutation({
    mutationFn: (p: { employee_id: string; fixed: number; variable: number; retention: number }) =>
      employeeService.submitPlanning({
        employee_id: p.employee_id,
        increment_pct_fixed: p.fixed,
        increment_pct_variable: p.variable,
        increment_pct_retention: p.retention,
      }),
    onSuccess: (res) => {
      setMessage({ type: 'success', text: res.message });
      setHasUnsavedChanges(false);
      employeesQuery.refetch();
    },
    onError: (err: any) => {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to submit.' });
    },
  });

  const handleSave = () => {
    if (!selectedEmpId) return;
    saveMutation.mutate({ employee_id: selectedEmpId, fixed: fixedPct, variable: variablePct, retention: retentionPct });
  };

  const handleSubmit = () => {
    if (!selectedEmpId) return;
    submitMutation.mutate({ employee_id: selectedEmpId, fixed: fixedPct, variable: variablePct, retention: retentionPct });
  };

  const handleReset = () => {
    setFixedPct(0); setVariablePct(0); setRetentionPct(0); setMessage(null);
  };

  const handleSelectEmployee = (empId: string) => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Do you want to discard them and switch employees?')) return;
    setSelectedEmpId(empId);
  };

  // Live projection using SAME rules as backend CalculationEngine
  const projection = useCallback(() => {
    const cur = currentSalaryQuery.data;
    if (!cur) return null;

    const curFixed = Number(cur.fixed_pay);
    const curVariable = Number(cur.variable_pay);
    const curRetention = Number(cur.retention_bonus);
    // Rule: Mediclaim stays constant; if 0, default to company standard 4330
    const curMediclaim = Number(cur.mediclaim) === 0 ? 4330 : Number(cur.mediclaim);
    const curGratuity = Number(cur.gratuity);

    // Rule: Fixed/Variable/Retention apply increment %; Mediclaim is constant
    const projFixed = Math.round(curFixed * (1 + fixedPct / 100));
    const projVariable = Math.round(curVariable * (1 + variablePct / 100));
    const projRetention = Math.round(curRetention * (1 + retentionPct / 100));
    const projMediclaim = curMediclaim; // CONSTANT — no increment applied
    // Rule: Gratuity = 2.5% of projected Fixed Pay (matches Excel formula)
    const projGratuity = Math.round(projFixed * 0.025);

    const projCTC = projFixed + projVariable + projRetention + projMediclaim + projGratuity;
    const currentTotalCTC = Number(cur.total_ctc);
    const diff = projCTC - currentTotalCTC;
    const growthPct = currentTotalCTC > 0 ? (diff / currentTotalCTC) * 100 : 0;

    return {
      fixed: projFixed,
      variable: projVariable,
      retention: projRetention,
      mediclaim: projMediclaim,
      gratuity: projGratuity,
      ctc: projCTC,
      diff,
      growthPct: isNaN(growthPct) ? 0 : growthPct,
      curFixed,
      curVariable,
      curRetention,
      curMediclaim,
      curGratuity,
    };
  }, [currentSalaryQuery.data, fixedPct, variablePct, retentionPct])();

  const currentEmp = employeesQuery.data?.items.find((e) => e.id === selectedEmpId);
  const curSalary = currentSalaryQuery.data;
  const isManager = user?.role === 'Manager';

  // Filter employees by search
  const filteredEmps = (employeesQuery.data?.items ?? []).filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      (e.current_designation ?? '').toLowerCase().includes(q)
    );
  });

  const statusDot: Record<string, string> = {
    Completed: 'bg-emerald-400',
    Submitted: 'bg-emerald-400',
    'In Progress': 'bg-amber-400',
    'Not Started': 'bg-slate-300',
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appraisal Planning</h1>
          <p className="text-sm text-slate-500 mt-1">Model compensation increments and review projected financial impact.</p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Unsaved Changes
          </div>
        )}
      </div>

      {/* Read-only banner for HR/Director */}
      {!isManager && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 text-xs text-blue-700 flex items-start gap-2.5">
          <Lock size={15} className="mt-0.5 shrink-0 text-blue-400" />
          <span>
            <strong>Read-Only View:</strong> As {user?.role}, you can inspect all compensation projections but cannot edit or submit planning changes.
          </span>
        </div>
      )}

      {/* Toast message */}
      {message && (
        <div className={`rounded-xl border p-3.5 text-xs flex items-center gap-2.5 ${
          message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'
        }`}>
          {message.type === 'success'
            ? <CheckCircle size={15} className="text-emerald-500 shrink-0" />
            : <AlertCircle size={15} className="text-red-500 shrink-0" />
          }
          <span className="font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto text-current opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* ── Left Panel: Employee Selector ── */}
        <div className="lg:col-span-1 rounded-xl border border-[#e2e8f0] bg-white shadow-sm flex flex-col" style={{ height: '78vh', minHeight: '600px' }}>
          {/* Panel header */}
          <div className="border-b border-[#e2e8f0] p-3.5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-indigo-600" size={15} />
                <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Team Directory</h2>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {employeesQuery.data?.items.length ?? 0} staff
              </span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, ID, role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-[11px] border border-slate-200 rounded-md bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Employee list */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {employeesQuery.isLoading ? (
              <p className="text-[11px] text-slate-400 p-4 text-center">Loading team...</p>
            ) : filteredEmps.length === 0 ? (
              <p className="text-[11px] text-slate-400 p-4 text-center">No results found.</p>
            ) : (
              filteredEmps.map((emp) => {
                const isActive = selectedEmpId === emp.id;
                return (
                  <button
                    key={emp.id}
                    onClick={() => handleSelectEmployee(emp.id)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 text-xs transition-all flex items-start justify-between gap-2 ${
                      isActive
                        ? 'bg-indigo-50 border border-indigo-200 shadow-sm'
                        : 'border border-transparent hover:bg-slate-50 hover:border-slate-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className={`font-bold truncate ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {emp.name}
                      </div>
                      <div className={`text-[10px] mt-0.5 font-mono ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                        {emp.id}
                      </div>
                      <div className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {emp.current_designation}
                      </div>
                    </div>
                    {/* Status dot */}
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${statusDot[emp.planning_status] ?? 'bg-slate-300'}`} title={emp.planning_status} />
                  </button>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="border-t border-slate-100 p-3 flex gap-3 flex-wrap">
            {[['bg-emerald-400', 'Completed'], ['bg-amber-400', 'In Progress'], ['bg-slate-300', 'Not Started']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel: Planning Workspace ── */}
        <div className="lg:col-span-3">
          {currentEmp && curSalary && projection ? (
            <div className="space-y-5">

              {/* Employee Header Card */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-200 flex-shrink-0">
                    {currentEmp.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">{currentEmp.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-1.5 items-center">
                      <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{currentEmp.id}</span>
                      <span className="text-slate-300">•</span>
                      <span>{currentEmp.current_designation}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-slate-600">{currentEmp.department_name}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-slate-600">
                        Hist. Avg. Inc: {currentEmp.historical_average_increment != null && !isNaN(Number(currentEmp.historical_average_increment)) ? `${Number(currentEmp.historical_average_increment).toFixed(2)}%` : 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
                <StatusBadge status={currentEmp.planning_status} />
              </div>

              {/* Row 1: Controls + Impact Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Increment Controls */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                    <Sliders className="text-indigo-600" size={15} />
                    <h2 className="text-sm font-bold text-slate-900">Increment Controls</h2>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    <NumericStepper
                      label="Fixed Salary %"
                      value={fixedPct}
                      onChange={setFixedPct}
                      disabled={!isManager}
                    />
                    <NumericStepper
                      label="Variable Pay %"
                      value={variablePct}
                      onChange={setVariablePct}
                      disabled={!isManager}
                    />
                    <NumericStepper
                      label="Retention Bonus %"
                      value={retentionPct}
                      onChange={setRetentionPct}
                      disabled={!isManager}
                    />
                    {/* Rules note */}
                    <div className="text-[10px] text-slate-400 bg-slate-50 rounded-md px-3 py-2 border border-slate-100 space-y-0.5">
                      <p>• Mediclaim remains <strong>constant</strong></p>
                      <p>• Gratuity = 2.5% of projected Fixed Pay</p>
                      <p>• Max increment: 50% per component</p>
                    </div>
                  </div>
                  {isManager && (
                    <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-slate-100">
                      <button
                        onClick={handleReset}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saveMutation.isPending || !hasUnsavedChanges}
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-40"
                      >
                        {saveMutation.isPending ? 'Saving...' : 'Save Draft'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Financial Impact Card */}
                <div className="rounded-xl border border-indigo-600 bg-gradient-to-br from-indigo-900 to-indigo-800 p-5 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-36 h-36 bg-indigo-700/40 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 border-b border-indigo-700/60 pb-3 mb-4">
                      <TrendingUp className="text-indigo-300" size={15} />
                      <h2 className="text-sm font-bold text-indigo-100">Financial Impact</h2>
                      <div className="ml-auto">
                        <StatusBadge status={currentEmp.planning_status} />
                      </div>
                    </div>

                    {/* CTC comparison */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <span className="block text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Current CTC</span>
                        <span className="text-lg font-bold text-indigo-200">{formatCurrency(curSalary.total_ctc)}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Projected CTC</span>
                        <span className="text-lg font-bold text-white">{formatCurrency(projection.ctc)}</span>
                      </div>
                    </div>

                    {/* Difference — prominent */}
                    <div className={`rounded-lg p-3 mb-3 ${projection.diff > 0 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-indigo-700/40 border border-indigo-600/30'}`}>
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-indigo-300 mb-1">Difference Amount</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-white">
                          {projection.diff >= 0 ? '+' : ''}{formatCurrency(projection.diff)}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          projection.diff > 0 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-indigo-600 text-indigo-300'
                        }`}>
                          {projection.growthPct >= 0 ? '+' : ''}{projection.growthPct.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Budget variance + Submit */}
                  <div className="relative z-10 pt-3 border-t border-indigo-700/60 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-indigo-400">Budget Variance</span>
                      <span className="text-sm font-bold text-indigo-200">
                        {projection.diff >= 0 ? '+' : ''}{formatCurrency(projection.diff)}
                      </span>
                    </div>
                    {isManager && (
                      <button
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={13} />
                        {submitMutation.isPending ? 'Submitting...' : 'Submit Final'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Compensation Breakdown: Current → Projected with diff */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Compensation Breakdown</h2>
                  <span className="text-[10px] text-slate-400">FY 2025-26 → FY 2026-27 (Projected)</span>
                </div>
                <div className="px-5 py-2">
                  {/* Column headers */}
                  <div className="grid grid-cols-[130px_1fr_32px_1fr] gap-2 pb-2 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Component</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Current</span>
                    <span />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Projected</span>
                  </div>
                  <CompRow
                    label="Fixed Pay"
                    current={projection.curFixed}
                    projected={projection.fixed}
                    pct={fixedPct}
                  />
                  <CompRow
                    label="Variable Pay"
                    current={projection.curVariable}
                    projected={projection.variable}
                    pct={variablePct}
                  />
                  <CompRow
                    label="Retention Bonus"
                    current={projection.curRetention}
                    projected={projection.retention}
                    pct={retentionPct}
                  />
                  <CompRow
                    label="Mediclaim"
                    current={projection.curMediclaim}
                    projected={projection.mediclaim}
                    isConstant
                  />
                  <CompRow
                    label="Gratuity (2.5% of Fixed)"
                    current={projection.curGratuity}
                    projected={projection.gratuity}
                  />
                  {/* Total row */}
                  <div className="grid grid-cols-[130px_1fr_32px_1fr] items-center gap-2 pt-3 mt-2 border-t-2 border-slate-200">
                    <span className="text-xs font-bold text-slate-900">Total CTC</span>
                    <span className="text-xs font-bold font-mono text-slate-700 text-right">{formatCurrency(curSalary.total_ctc)}</span>
                    <ArrowRight size={12} className="text-slate-300 mx-auto" />
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs font-extrabold font-mono text-indigo-900">{formatCurrency(projection.ctc)}</span>
                      {projection.diff > 0 && (
                        <span className="text-[9px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded">
                          +{projection.growthPct.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Empty state */
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-slate-300">
                <Sliders size={22} />
              </div>
              <p className="text-sm font-bold text-slate-700">Select an employee to begin</p>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs">
                Pick a team member from the directory panel on the left to model their compensation increments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
