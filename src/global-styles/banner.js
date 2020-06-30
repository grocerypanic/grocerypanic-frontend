import styled from "styled-components";
import { itemAttributes } from "../configuration/theme";

export const Banner = styled.div`
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
`;

export const ItemizedBanner = styled.div`
  width: 100%;
  margin-left: ${itemAttributes.border}px;
  margin-right: ${itemAttributes.border}px;
  text-align: center;
`;
