import React from "react";
import styled from "styled-components";
const Container = styled.div``;

/**
 * Functional Component:: Mobile environment's Layout
 * @param {props} content <Container>{content}</Container>
 */
export default function MobileTemplate({ content }) {
	return <Container>{content}</Container>;
}
