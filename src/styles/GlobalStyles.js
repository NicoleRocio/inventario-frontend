import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }

  body, html, #root {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    font-family: "Poppins", sans-serif;
    color: #1f1f1f;
  }

  /* Títulos */
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 6px;
  }

  /* Párrafos */
  p {
    font-size: 15px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  /* Etiquetas de formularios */
  label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    display: inline-block;
  }

  /* Inputs y selects */
  input, select, textarea {
    font-size: 14px;
    font-family: "Poppins", sans-serif;
  }

  /* Botones */
  button {
    font-size: 14px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    cursor: pointer;
  }
`;

export default GlobalStyles;
