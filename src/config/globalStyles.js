import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const globalStyles = createGlobalStyle`
    ${reset}
    a {color: #fff; text-decoration: none; outline: none}

    a:hover, a:active {text-decoration: none;}
`;

export default globalStyles;
