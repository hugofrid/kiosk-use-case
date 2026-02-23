import { MantineProvider } from "@mantine/core";
import React, { type PropsWithChildren } from "react";
// theme.ts
import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "mainGreen",

  fontFamily: '"DM Sans", sans-serif',
  headings: {
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: "600",
  },

  radius: {
    xs: rem(6),
    sm: rem(10),
    md: rem(18),
    lg: rem(32),
    xl: rem(42), // ton button/card radius
  },

  colors: {
    mainGreen: [
      "#e6f2f1",
      "#cce5e3",
      "#99cbc7",
      "#66b1ab",
      "#33978f",
      "#002e2a", // 5 = base
      "#002823",
      "#00221d",
      "#001b16",
      "#001510",
    ],

    mediumGreen: [
      "#e6fdf1",
      "#c2f9de",
      "#8df3bf",
      "#59eca1",
      "#2ee586",
      "#00c55d", // base
      "#00a84f",
      "#008c42",
      "#006f35",
      "#005428",
    ],

    bluePrimary: [
      "#ececff",
      "#d6d6ff",
      "#adadff",
      "#8585ff",
      "#5c5cff",
      "#4747f6", // base
      "#3c3cd1",
      "#3131ac",
      "#262687",
      "#1c1c63",
    ],

    lightBlue: [
      "#e6fbff",
      "#c5f5ff",
      "#8deaff",
      "#5ce0ff",
      "#47d6ff", // base
      "#2dbfe6",
      "#1fa2c2",
      "#16859e",
      "#0f687a",
      "#084c57",
    ],

    greyCustom: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#cfcfcf", // base
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
  },

  other: {
    offWhite: "#f8fafc",
    darkGreen: "#002e2a",
    lighterBlack: "#032d2a",
    darkBlue: "#171755",
    fluoGreen: "#c5ff9e",
    tertiaryGreen: "#d1fae5",
    lightGreen: "#c6ffc5",
    mainGreenLight: "#002e2a1a",
    impactGreen: "#eaf9ed",
  },

  components: {
    Button: {
      defaultProps: {
        radius: "xl",
      },
    },

    Card: {
      defaultProps: {
        radius: "xl",
        padding: "lg",
      },
    },

    Paper: {
      defaultProps: {
        radius: "xl",
      },
    },
  },
});

const ThemeProvider = ({ children }: PropsWithChildren) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
};

export default ThemeProvider;
