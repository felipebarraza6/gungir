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
    "Ventas, cotizaciones, inventario, clientes y finanzas. Sin gastronomía: comercio general multi-sucursal.",
  cta: "Empezar ahora",
  contactEmail: "hola@gungir.cl",
};

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Qué hace Gungir hoy — copy para el cliente final. */
export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: Zap,
    title: "Ventas rápidas",
    description: "Cobra en segundos con catálogo, descuentos y varios medios de pago.",
  },
  {
    icon: FileText,
    title: "Cotizaciones",
    description: "Presupuestos convertibles a venta, con PDF y seguimiento de estado.",
  },
  {
    icon: Package,
    title: "Catálogo de productos",
    description: "Productos, categorías, precios y fotos por sucursal.",
  },
  {
    icon: Warehouse,
    title: "Inventario",
    description: "Stock, movimientos y alertas de quiebre en tiempo real.",
  },
  {
    icon: Users,
    title: "Clientes",
    description: "Fichas, historial de compras y área de autogestión.",
  },
  {
    icon: Banknote,
    title: "Caja y finanzas",
    description: "Apertura, cierre, ingresos, egresos y conciliación.",
  },
  {
    icon: ShoppingCart,
    title: "Compras y proveedores",
    description: "Órdenes de compra y recepción de mercadería.",
  },
  {
    icon: Store,
    title: "Multi-sucursal",
    description: "Varios locales desde una sola cuenta, cada uno con su marca.",
  },
  {
    icon: BarChart3,
    title: "Reportes",
    description: "Ventas, stock y caja con visión clara del negocio.",
  },
  {
    icon: ShieldCheck,
    title: "Roles y permisos",
    description: "Dueño, encargado y cajero con acceso justo a lo que necesitan.",
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
      "Clientes y autogestión",
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
      "Sucursales amplias",
      "Usuarios según plan",
      "Todo Negocio",
      "Reportes avanzados",
      "White-label por local",
      "Onboarding asistido",
    ],
  },
];

export const LANDING_PRICING_NOTE =
  "Precios en UF / mes. Todos los planes incluyen los módulos del producto. La integración se cotiza aparte.";
