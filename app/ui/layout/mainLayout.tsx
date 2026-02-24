import { Container } from "@mantine/core";
import { type PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-amber-50 max-h-screen h-screen overflow-hidden flex flex-col items-stretch">
      <div className="p-3 bg-green-900 text-white ">
        <Container className="max">Kios use case </Container>
      </div>
      {children}
    </div>
  );
};

export default MainLayout;
