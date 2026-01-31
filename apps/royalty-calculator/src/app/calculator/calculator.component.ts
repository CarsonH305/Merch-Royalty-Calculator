import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { calculate, type CalculatorInput, type CalculatorResult, type PricingFieldLastEdited } from '@merch/calculation-engine';
import { environment } from '../../environments/environment';
import { ScenariosService, type Scenario } from '../scenarios.service';
import { FIELD_TOOLTIPS, RESULT_TOOLTIPS, SECTION_TOOLTIPS } from './field-tooltips';
import { FIELD_REQUIREMENTS, SECTION_REQUIREMENTS } from './field-requirements';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  readonly Math = Math;
  readonly isNaN = isNaN;
  private round2 = (n: number) => Math.round(n * 100) / 100;
  roundValue = (val: number | string | null): number | null =>
    val !== '' && val != null && !isNaN(+val) ? this.round2(+val) : null;

  focusedField = signal<string | null>(null);

  /** Format number for input display. When focused (padDecimals=false), no decimal padding; when blurred, add commas + pad decimals */
  formatInputDisplay = (val: number | null, decimals = 2, padDecimals = true): string => {
    if (val === null || val === undefined || isNaN(val)) return '';
    const n = this.round2(val);
    const fixed = padDecimals ? n.toFixed(decimals) : n.toFixed(decimals).replace(/\.?0+$/, '');
    const [intPart, decPart] = fixed.split('.');
    const withCommas = parseInt(intPart || '0', 10).toLocaleString('en-US');
    return decPart !== undefined && decPart !== '' ? `${withCommas}.${decPart}` : withCommas;
  };

  /** Parse input string with commas to number */
  parseInputValue = (val: string | null): number | null => {
    if (val === '' || val === null || val === undefined) return null;
    const cleaned = String(val).replace(/,/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? null : n;
  };

  setUnitsFromInput = (val: string): void => {
    const parsed = this.parseInputValue(val);
    this.units.set(parsed != null ? Math.max(1, Math.round(parsed)) : null);
  };

  /** Re-parse and re-format on blur to ensure commas and correct decimals display */
  formatInputOnBlur = (field: string): void => {
    const setters: Record<string, () => void> = {
      cost: () => this.cost.set(this.cost() != null ? this.round2(this.cost()!) : null),
      markupPercent: () => this.markupPercent.set(this.markupPercent() != null ? this.round2(this.markupPercent()!) : null),
      salePricePerUnit: () => this.salePricePerUnit.set(this.salePricePerUnit() != null ? this.round2(this.salePricePerUnit()!) : null),
      units: () => this.units.set(this.units() != null ? Math.max(1, Math.round(this.units()!)) : null),
      returnsPercent: () => this.returnsPercent.set(this.returnsPercent() != null ? this.round2(this.returnsPercent()!) : null),
      shippingCost: () => this.shippingCost.set(this.shippingCost() != null ? this.round2(this.shippingCost()!) : null),
      taxesAmount: () => this.taxesAmount.set(this.taxesAmount() != null ? this.round2(this.taxesAmount()!) : null),
      discountsAmount: () => this.discountsAmount.set(this.discountsAmount() != null ? this.round2(this.discountsAmount()!) : null),
      otherCosts: () => this.otherCosts.set(this.otherCosts() != null ? this.round2(this.otherCosts()!) : null),
      royaltyPercent: () => this.royaltyPercent.set(this.royaltyPercent() != null ? this.round2(this.royaltyPercent()!) : null),
      royaltyPerUnit: () => this.royaltyPerUnit.set(this.royaltyPerUnit() != null ? this.round2(this.royaltyPerUnit()!) : null),
    };
    setters[field]?.();
  };
  showRoyalties = signal(false);
  pricingFieldLastEdited = signal<PricingFieldLastEdited | null>(null);
  cost = signal<number | null>(null);
  markupPercent = signal<number | null>(null);
  salePricePerUnit = signal<number | null>(null);
  units = signal<number | null>(null);
  returnsPercent = signal<number | null>(null);
  shippingCost = signal<number | null>(null);
  taxesAmount = signal<number | null>(null);
  discountsAmount = signal<number | null>(null);
  otherCosts = signal<number | null>(null);
  royaltyPercent = signal<number | null>(null);
  royaltyBase = signal<'gross' | 'net'>('net');
  royaltyPerUnit = signal<number | null>(null);
  royaltyType = signal<'percentage' | 'per-unit'>('percentage');

  result = signal<CalculatorResult | null>(null);
  scenarios = signal<Scenario[]>([]);
  scenarioName = signal('');
  showRecommendations = signal(false);
  apiUrl = environment.apiUrl || 'http://localhost:3333';

  getFieldTooltip(key: string): string {
    return FIELD_TOOLTIPS[key] ?? '';
  }

  getSectionTooltip(key: string): string {
    return SECTION_TOOLTIPS[key] ?? '';
  }

  getResultTooltip(key: string): string {
    return RESULT_TOOLTIPS[key] ?? '';
  }

  getFieldRequirement(key: string): string {
    return FIELD_REQUIREMENTS[key] ?? '';
  }

  getSectionRequirement(key: string): string {
    return SECTION_REQUIREMENTS[key] ?? '';
  }

  hasAnyInputs(): boolean {
    return (
      this.cost() != null || this.markupPercent() != null || this.salePricePerUnit() != null ||
      this.returnsPercent() != null || this.shippingCost() != null || this.taxesAmount() != null ||
      this.discountsAmount() != null || this.otherCosts() != null
    );
  }

  abnormalFlags(): { id: string; message: string; severity: 'warning' | 'error' }[] {
    const flags: { id: string; message: string; severity: 'warning' | 'error' }[] = [];
    const ret = this.returnsPercent();
    if (ret != null && ret > 15) {
      flags.push({ id: 'returns-high', message: `High return rate (${ret}%). Typical range is 2–8%.`, severity: ret > 25 ? 'error' : 'warning' });
    }
    const res = this.result();
    if (res && res.netMarginPercent < 10 && res.revenue > 0) {
      flags.push({ id: 'margin-low', message: `Low net margin (${this.round2(res.netMarginPercent).toFixed(2)}%). Consider reducing costs or increasing revenue.`, severity: 'warning' });
    }
    if (res && res.grossMarginPercent < 20 && res.revenue > 0) {
      flags.push({ id: 'gross-margin-low', message: `Low gross margin (${this.round2(res.grossMarginPercent).toFixed(2)}%). Markup may be too thin.`, severity: 'warning' });
    }
    const ship = this.shippingCost();
    const rev = res?.revenue ?? 0;
    if (ship != null && rev > 0 && ship / rev > 0.2) {
      flags.push({ id: 'shipping-high', message: `Shipping costs are high relative to revenue (${this.round2((ship / rev) * 100).toFixed(2)}%).`, severity: 'warning' });
    }
    return flags;
  }

  getRecommendations(): string[] {
    const recs: string[] = [];
    const ret = this.returnsPercent();
    if (ret != null && ret > 10) {
      recs.push('Review product quality and sizing charts to reduce return rates.');
    }
    const res = this.result();
    if (res && res.netMarginPercent < 15) {
      recs.push('Negotiate better COGS with suppliers or increase markup.');
      recs.push('Audit deductions—shipping, returns, and discounts—for optimization.');
    }
    if (res && this.royaltyPercent() != null && this.royaltyPercent()! > 15) {
      recs.push('Consider negotiating royalty terms; industry often ranges 8–12% on net.');
    }
    if (recs.length === 0) {
      recs.push('Your inputs look healthy. Focus on volume and operational efficiency.');
    }
    return recs;
  }

  private inputsEffect = effect(
    () => {
    const input: CalculatorInput = {
      mode: this.showRoyalties() ? 'artist-label' : 'merch-only',
      pricingFieldLastEdited: this.pricingFieldLastEdited() ?? undefined,
      cost: this.cost() ?? undefined,
      markupPercent: this.markupPercent() ?? undefined,
      salePricePerUnit: this.salePricePerUnit() ?? undefined,
      units: this.units() ?? 100,
      returnsPercent: this.returnsPercent() ?? undefined,
      shippingCost: this.shippingCost() ?? undefined,
      taxesAmount: this.taxesAmount() ?? undefined,
      discountsAmount: this.discountsAmount() ?? undefined,
      otherCosts: this.otherCosts() ?? undefined,
      royaltyPercent: this.royaltyPercent() ?? undefined,
      royaltyBase: this.royaltyBase(),
      royaltyPerUnit: this.royaltyPerUnit() ?? undefined,
      royaltyType: this.royaltyType(),
    };
    const res = calculate(input);
    this.result.set(res);
    // Auto-fill computed values into inputs so they display
    if (res.computed.revenue) this.salePricePerUnit.set(this.round2(res.revenue / res.units));
    if (res.computed.markupPercent) this.markupPercent.set(this.round2(res.markupPercent));
    if (res.computed.cost) this.cost.set(this.round2(res.cost));
    },
    { allowSignalWrites: true }
  );

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private scenariosService: ScenariosService
  ) {}

  ngOnInit() {
    this.loadScenarios();
  }

  loadScenarios() {
    this.scenariosService.list().subscribe({
      next: (list) => this.scenarios.set(list),
      error: () => {}, // Silently fail if API unavailable
    });
  }

  loadScenario(s: Scenario) {
    const i = s.input as Record<string, unknown>;
    this.showRoyalties.set((s.mode as string) === 'artist-label');
    this.cost.set(i.cost != null ? this.round2(i.cost as number) : null);
    this.markupPercent.set(i.markupPercent != null ? this.round2(i.markupPercent as number) : null);
    const spu = i.salePricePerUnit as number | undefined;
    const rev = i.revenue as number | undefined;
    const u = (i.units as number) ?? 100;
    this.salePricePerUnit.set(spu != null ? this.round2(spu) : (rev != null && u > 0 ? this.round2(rev / u) : null));
    this.units.set((i.units as number) ?? null);
    this.returnsPercent.set(i.returnsPercent != null ? this.round2(i.returnsPercent as number) : null);
    this.shippingCost.set(i.shippingCost != null ? this.round2(i.shippingCost as number) : null);
    this.taxesAmount.set(i.taxesAmount != null ? this.round2(i.taxesAmount as number) : null);
    this.discountsAmount.set(i.discountsAmount != null ? this.round2(i.discountsAmount as number) : null);
    this.otherCosts.set(i.otherCosts != null ? this.round2(i.otherCosts as number) : null);
    this.royaltyPercent.set(i.royaltyPercent != null ? this.round2(i.royaltyPercent as number) : null);
    this.royaltyBase.set((i.royaltyBase as 'gross' | 'net') ?? 'net');
    this.royaltyPerUnit.set(i.royaltyPerUnit != null ? this.round2(i.royaltyPerUnit as number) : null);
    this.royaltyType.set((i.royaltyType as 'percentage' | 'per-unit') ?? 'percentage');
    this.scenarioName.set(s.name);
    this.snackBar.open('Scenario loaded', 'Close', { duration: 2000 });
  }

  formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
  formatPercent = (val: number) => `${this.round2(val).toFixed(2)}%`;
  formatNumber = (val: number) => this.round2(val).toFixed(2);

  saveScenario() {
    const res = this.result();
    if (!res) return;
    const name = this.scenarioName() || `Scenario ${new Date().toLocaleString()}`;
    this.scenariosService
      .create({ name, input: this.getInputSnapshot(), result: res as unknown as Record<string, unknown>, mode: this.showRoyalties() ? 'artist-label' : 'merch-only' })
      .subscribe({
        next: () => {
          this.snackBar.open('Scenario saved', 'Close', { duration: 3000 });
          this.loadScenarios();
        },
        error: () => this.snackBar.open('Failed to save. Is the API running?', 'Close', { duration: 5000 }),
      });
  }

  exportCsv() {
    const res = this.result();
    if (!res) return;
    const rows = [
      ['Metric', 'Value'],
      ['Gross Revenue', this.formatCurrency(res.revenue)],
      ['Net Revenue', this.formatCurrency(res.netRevenue)],
      ['COGS', this.formatCurrency(res.cost * res.units)],
      ['Artist Royalty', this.formatCurrency(res.royaltyAmount)],
      ['Company Profit', this.formatCurrency(res.merchCompanyNet)],
      ['Gross Margin %', this.formatPercent(res.grossMarginPercent)],
      ['Net Margin %', this.formatPercent(res.netMarginPercent)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `royalty-calc-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    this.snackBar.open('CSV exported', 'Close', { duration: 2000 });
  }

  private getInputSnapshot(): Record<string, unknown> {
    const r2 = this.round2;
    const v = (n: number | null) => n != null ? r2(n) : null;
    return {
      cost: v(this.cost()),
      markupPercent: v(this.markupPercent()),
      salePricePerUnit: v(this.salePricePerUnit()),
      units: this.units(),
      returnsPercent: v(this.returnsPercent()),
      shippingCost: v(this.shippingCost()),
      taxesAmount: v(this.taxesAmount()),
      discountsAmount: v(this.discountsAmount()),
      otherCosts: v(this.otherCosts()),
      royaltyPercent: v(this.royaltyPercent()),
      royaltyBase: this.royaltyBase(),
      royaltyPerUnit: v(this.royaltyPerUnit()),
      royaltyType: this.royaltyType(),
    };
  }
}
