import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useApp } from "../../context/AppContext";
import { allowed, money } from "../../domain/business.mjs";
import FigmaImage from "../../components/FigmaImage";
import { Screen, Card, Button, Empty } from "../../components/UI";
import { styles as s, colors } from "../../theme/theme";
export default function Producto() {
  const { id } = useLocalSearchParams();
  const { user, state } = useApp();
  const p = state.productos.find((p) => p.id === id && p.activo);
  return (
    <Screen title="Ficha Técnica">
      <Button
        secondary
        title="‹ Inventario"
        onPress={() => router.replace("/inventario")}
      />
      {!p ? (
        <Empty text="Este producto no está disponible." />
      ) : (
        <>
          <FigmaImage
            product={p}
            detail
            style={{
              height: 220,
              width: "100%",
              borderRadius: 16,
              backgroundColor: "white",
            }}
          />
          <View style={s.row}>
            <View
              style={{
                backgroundColor: "#FEF3C7",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <Text
                style={{ fontSize: 12, color: "#92400E", fontWeight: "700" }}
              >
                {p.categoria.toUpperCase()}
              </Text>
            </View>
            <Text style={[s.heading, { fontSize: 24 }]}>
              {money(p.precioCentavos)} USD
            </Text>
          </View>
          <Text style={[s.heading, { fontSize: 20 }]}>{p.nombre}</Text>
          <Card>
            <View style={s.row}>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={s.small}>Stock Actual</Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.primary,
                  }}
                >
                  {p.stock} unidades
                </Text>
              </View>
              <View
                style={{ width: 1, height: 40, backgroundColor: colors.line }}
              />
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={s.small}>Umbral Mínimo</Text>
                <Text style={s.heading}>{p.stockMinimo} unidades</Text>
              </View>
            </View>
          </Card>
          <Text style={s.label}>Descripción del Catálogo</Text>
          <Text style={s.subtitle}>
            {p.descripcion ||
              `${p.nombre}. Producto de la categoría ${p.categoria}, disponible en Comerciales Mely.`}
          </Text>
          {allowed(user, "product") && (
            <Button
              title="Editar producto / fotografía"
              onPress={() =>
                router.replace({
                  pathname: "/inventario",
                  params: { edit: p.id },
                })
              }
            />
          )}
        </>
      )}
    </Screen>
  );
}
