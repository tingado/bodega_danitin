# Flujo Físico de la Bodega — bodega_danitin

> Extraído del video IMG_0879.MOV (1:42 min) — 2026-06-15  
> Tipo de espacio: bodega interior de hormigón/chapa, sin ventanas, iluminación artificial.

---

## 1. Zonas Identificadas

| ID Zona | Nombre | Descripción | Tipo de almacenamiento |
|---|---|---|---|
| Z-01 | Entrada / Zona de Tránsito | Pasillo angosto de acceso, piso de hormigón gris | Ítems de gran volumen en el piso, cajas sueltas |
| Z-02 | Estantería Azul-Naranja (Izquierda) | Rack metálico azul con vigas naranjas, múltiples niveles | Bolsas, ropa, cajas medianas |
| Z-03 | Estantería Madera-Naranja (Centro/Derecha) | Estante con estructura de madera y vigas naranjas | Cajas grandes, contenedores plásticos |
| Z-04 | Zona de Piso / Pallets | Piso junto a la pared del fondo, con pallet de madera | Ítems embalados en film plástico, muebles |
| Z-05 | Estantería Chapa / Rincón | Pequeña estantería de chapa metálica, zona lateral | Contenedores plásticos de colores, bolsos deportivos |
| Z-06 | Pasillo Central | Corredor de tránsito entre estanterías izquierda y derecha | Libre (no almacenar) |

---

## 2. Mapa de Ubicaciones

| ID Ubicación | Zona | Estante | Nivel | Descripción de posición |
|---|---|---|---|---|
| UB-01 | Z-01 | — | Piso | Entrada izquierda — caja sillón ejecutivo m+Design |
| UB-02 | Z-01 | — | Piso | Entrada — carrito/rack metálico negro |
| UB-03 | Z-02 | Rack Azul | N1 (bajo) | Bolsos deportivos, bolsas de viaje |
| UB-04 | Z-02 | Rack Azul | N2 (medio) | Contenedores plásticos amarillo/azul (tipo Rak) |
| UB-05 | Z-02 | Rack Azul | N3 (alto) | Contenedores plásticos amarillo (apilados) |
| UB-06 | Z-02 | Rack Azul | N1 (bajo, lateral) | Bolso deportivo negro/naranja, bolsa tela azul |
| UB-07 | Z-03 | Estante Madera | N1 (bajo) | Caja de cartón (productos del hogar), contenedor negro tapa verde |
| UB-08 | Z-03 | Estante Madera | N2 (medio) | Contenedor plástico negro/tapa amarilla con etiqueta, cajas de cartón |
| UB-09 | Z-03 | Estante Madera | N3 (alto) | Cajas de cartón grandes, bidón blanco con tapa |
| UB-10 | Z-04 | — | Piso/Pallet | Ítem grande embalado en film plástico transparente sobre pallet con ruedas |
| UB-11 | Z-04 | — | Piso | Mueble blanco (cabecera/silla antigua), mueble oscuro |
| UB-12 | Z-05 | Estante Chapa | N1 (bajo) | Contenedor plástico gris grande con tapa + etiqueta con código de barras |
| UB-13 | Z-05 | Estante Chapa | N2 (medio) | Contenedores plásticos azul + amarillo (tipo Rak apilados) |
| UB-14 | Z-03 | Estante Madera | N1 (bajo, piso) | Carro/plataforma de madera con ruedas (herramienta de movimiento) |

---

## 3. Catálogo de Tipos de Objetos

| ID Tipo | Categoría | Subcategoría | Ejemplos observados | Embalaje típico |
|---|---|---|---|---|
| CAT-01 | Muebles | Sillas de oficina | Sillón ejecutivo m+Design 222 3.0 (negro, con ruedas) | Caja de cartón original |
| CAT-02 | Muebles | Muebles antiguos/decoración | Silla estilo Luis XV blanca, cabecera, mueble de madera oscuro | Sin embalaje / embalado en film |
| CAT-03 | Equipaje y Bolsos | Bolsos deportivos | Bolso hockey/deporte negro-naranja, bolsa tela azul con huellas, bolsa beige | Sin caja, apilados en estante |
| CAT-04 | Equipaje y Bolsos | Bolsas de tela/compras | Bolsa TJ-Maxx (tela), bolsa floral rosa (tipo "Bolea"/tejido), bolsa beige tela | Sueltas en estante |
| CAT-05 | Textiles / Ropa | Ropa y accesorios textiles | Prendas en bolsas, ropa variada (roja, azul, estampados) | Bolsas de tela o nylon |
| CAT-06 | Contenedores plásticos | Contenedores herméticos grandes | Contenedor negro tapa gris (Sterilite/similar, 60L aprox.) con código de barras | N/A (es el contenedor) |
| CAT-07 | Contenedores plásticos | Cajas de almacenamiento medianas | Contenedores negro/tapa amarilla, azul/tapa amarilla (tipo Rak Box) | N/A |
| CAT-08 | Contenedores plásticos | Cajas organizadoras pequeñas | Cajones plásticos amarillo/azul apilables (tipo Rak organizador) | N/A |
| CAT-09 | Cajas de cartón | Cajas cerradas sin identificar | Cajas medianas y grandes de cartón marrón, algunas con texto en chino/inglés | Caja de cartón |
| CAT-10 | Electrodomésticos / Hogar | Pequeños electrodomésticos | Bidón/jarra blanca con tapa negra (posible purificador o cafetera grande) | Caja original + film |
| CAT-11 | Herramientas de bodega | Carro/plataforma | Carro de madera con ruedas para mover ítems pesados | N/A |
| CAT-12 | Ítems embalados para despacho | Paquetes grandes | Ítem grande en film transparente sobre pallet con ruedas (posible mueble/equipo) | Film stretch + pallet |

---

## 4. Estructura Física Resumida

```
BODEGA — Vista de planta aproximada

[ENTRADA]
    │
    │  Z-01: Zona de tránsito
    │  UB-01 Sillón en caja │ UB-02 Carrito metálico
    │
    ├─────────────────────────────────────────────────────┐
    │  Z-06: PASILLO CENTRAL (libre)                      │
    │                                                     │
    │  Z-02: Rack Azul (IZQ)    Z-03: Estante Madera (DER)│
    │  UB-03 N1 Bolsos          UB-07 N1 Cajas cartón     │
    │  UB-04 N2 Cont. Azul/Am   UB-08 N2 Cont. negro/am   │
    │  UB-05 N3 Cont. Amarillo  UB-09 N3 Cajas grandes    │
    │                           UB-14 Piso: carro ruedas  │
    │                                                     │
    │  Z-05: Estante Chapa      Z-04: Piso / Pallet       │
    │  UB-12 N1 Cont. gris      UB-10 Film stretch        │
    │  UB-13 N2 Cont. azul/am   UB-11 Muebles sueltos     │
    └─────────────────────────────────────────────────────┘
                         [FONDO]
```

---

## 5. Observaciones para el Sistema de Gestión

| Observación | Implicancia para el sistema |
|---|---|
| Los contenedores plásticos ya tienen etiquetas con código de barras en algunos casos | El sistema QR puede convivir con/reemplazar etiquetas existentes |
| Algunos ítems están "en tránsito" (embalados en film, sin ubicación fija) | Necesitamos estados: `en_stock`, `en_tránsito`, `pendiente_despacho` |
| El carrito de ruedas es una herramienta de bodega, no un ítem de stock | Crear categoría `HERRAMIENTA_BODEGA` excluida de inventario de stock |
| Hay ítems de alto valor (muebles, sillón ejecutivo) que requieren identificación precisa | Campo `valor_estimado` y `prioridad` en el esquema de ítems |
| El espacio es compacto — la ubicación exacta (zona + estante + nivel) es crítica | La tripleta `zona_id + estante_id + nivel` debe ser el localizador único |
| Algunos ítems no tienen embalaje visible (muebles sueltos) | QR debe ir directo en el ítem o en una tarjeta/etiqueta colgante |

---

## 6. Campos Adicionales Detectados

A partir de este video, se sugieren los siguientes campos para el esquema de datos (Etapa 2):

- `estado_embalaje`: `en_caja_original` / `en_film` / `sin_embalaje` / `en_contenedor`
- `requiere_dos_personas`: `boolean` (para ítems de gran volumen)
- `foto_url`: link a foto del ítem en Drive
- `notas_ubicacion`: texto libre (ej. "detrás del carro de madera")
