import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  BarChart3,
  FileText,
  Package,
  ShieldCheck,
  ShoppingCart,
  Store,
  Users,
  Warehouse,
  Zap,
} from "lucide-react";

export const GUNGIR_FALLBACK = {
  appName: "Gungir",
  headline: "Tu negocio completo, en una sola web",
  subhead:
    "Ventas, cotizaciones, inventario, clientes y finanzas. Comercio general multi-sucursal — sin instalar nada.",
  cta: "Probar demo",
  contactEmail: "hola@gungir.cl",
  points: [
    "Cotizaciones y ventas en el mismo flujo",
    "Inventario y caja al día",
    "Tu marca en cada sucursal",
  ],
};

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: Zap,
    title: "Ventas rápidas",
    description: "Cobra en segundos con catálogo, descuentos y varios medios de pago.",
  },
  {
    icon: FileText,
    title: "Cotizaciones",
    description: "Presupuestos con PDF, vigencia y conversión a venta.",
  },
  {
    icon: Package,
    title: "Catálogo",
    description: "Productos, categorías, precios y fotos por sucursal.",
  },
  {
    icon: Warehouse,
    title: "Inventario",
    description: "Stock, movimientos y alertas de quiebre.",
  },
  {
    icon: Users,
    title: "Clientes",
    description: "Fichas, historial y portal de autogestión.",
  },
  {
    icon: Banknote,
    title: "Caja y finanzas",
    description: "Apertura, cierre, ingresos, egresos y conciliación.",
  },
  {
    icon: ShoppingCart,
    title: "Compras",
    description: "Proveedores, órdenes de compra y recepción.",
  },
  {
    icon: Store,
    title: "Multi-sucursal",
    description: "Varios locales, una cuenta, marca por sucursal.",
  },
  {
    icon: BarChart3,
    title: "Reportes",
    description: "Ventas, stock y caja con visión clara.",
  },
  {
    icon: ShieldCheck,
    title: "Roles",
    description: "Dueño, encargado y cajero con permisos justos.",
  },
];

export interface LandingPlan {
  id: string;
  name: string;
  tagline: string;
  priceUf: number | null;
  resources: string[];
  highlighted?: boolean;
  badge?: string | null;
}

export const LANDING_INTEGRATION_UF = 1;

export const LANDING_PLANS: LandingPlan[] = [
  {
    id: "emprendimiento",
    name: "Emprendimiento",
    tagline: "Para partir con un local",
    priceUf: 8,
    resources: ["1 sucursal", "2 usuarios", "Ventas y cotizaciones", "Inventario", "Soporte email"],
  },
  {
    id: "negocio",
    name: "Negocio",
    tagline: "Para operar el día a día",
    priceUf: 14,
    resources: [
      "3 sucursales",
      "10 usuarios",
      "Todo Emprendimiento",
      "Caja y finanzas",
      "Clientes",
      "Soporte prioritario",
    ],
    highlighted: true,
    badge: "Más elegido",
  },
  {
    id: "red",
    name: "Red",
    tagline: "Para varias sucursales",
    priceUf: 22,
    resources: [
      "Más sucursales",
      "Usuarios según plan",
      "Todo Negocio",
      "Reportes avanzados",
      "White-label",
      "Onboarding asistido",
    ],
  },
];

export const LANDING_PRICING_NOTE =
  "Precios en UF / mes. Todos los planes incluyen los módulos del producto.";

/** Demos públicas — como Frig, por rubro. */
export interface LandingDemo {
  slug: string;
  name: string;
  rubro: string;
  highlight: string;
  color: string;
  user: string;
  password: string;
}

export const LANDING_DEMOS: LandingDemo[] = [
  {
    slug: "retail",
    name: "Almacén Norte",
    rubro: "Retail",
    highlight: "Catálogo + stock + caja",
    color: "#d4a017",
    user: "retail@demo.gungir.cl",
    password: "Demo2026!",
  },
  {
    slug: "servicios",
    name: "Taller Precisión",
    rubro: "Servicios",
    highlight: "Cotizaciones → venta",
    color: "#7dd3c0",
    user: "servicios@demo.gungir.cl",
    password: "Demo2026!",
  },
  {
    slug: "distribucion",
    name: "Distribuidora Sur",
    rubro: "Distribución",
    highlight: "Multi-sucursal + compras",
    color: "#a78bfa",
    user: "dist@demo.gungir.cl",
    password: "Demo2026!",
  },
];
