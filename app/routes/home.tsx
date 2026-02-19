import { Container, MantineProvider } from "@mantine/core";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kiosk lead use case" },
    { name: "description", content: "kiosk use case " },
  ];
}

export default function Home() {
  return (
    <MantineProvider>
      <Container></Container>
    </MantineProvider>
  );
}
