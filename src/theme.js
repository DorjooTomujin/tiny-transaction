import { extendTheme } from "@chakra-ui/react";
const fonts = { mono: `'Menlo', monospace` };

const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",
};
const activeLabelStyles = {
  transform: "scale(0.75) translateY(-16px)",
};
const theme = extendTheme({
  breakpoints,
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: -2,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "transparent",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        // bg
      },
    },
  },
  colors: {
    bg: {
      input: "#F5F6F7",
      btn: "#2F66E3",
    },
    text: {
      label: "rgba(0,0,0,0.6)",
    },
  },
});

export default theme;
