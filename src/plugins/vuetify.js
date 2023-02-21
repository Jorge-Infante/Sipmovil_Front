// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
export default createVuetify(
  {
    theme: {
      defaultTheme: "dark",
    },
    components,
    directives,
  }
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
);
