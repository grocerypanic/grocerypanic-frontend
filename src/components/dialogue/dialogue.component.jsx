import React from "react";
import PropTypes from "prop-types";

import Header from "../header/header.component";
import calculateMaxHeight from "../../util/height";

import { Paper, Container } from "../../global-styles/containers";
import { Banner, Scroller, ContentBorder, Content } from "./dialogue.styles";

const Dialogue = ({ headerTitle, title, body, Footer }) => {
  const [listSize, setListSize] = React.useState(calculateMaxHeight());
  const recalculateHeight = () => setListSize(calculateMaxHeight());

  React.useEffect(() => {
    window.addEventListener("resize", recalculateHeight);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
    };
  }, []);

  return (
    <>
      <Header title={headerTitle} transaction={false} />
      <Container>
        <Paper>
          <Banner className="alert alert-success">
            <div>{title}</div>
          </Banner>
          <Scroller className="overflow-auto" size={listSize}>
            <ContentBorder>
              <Content>
                {body.split("\n").map((string, index) => (
                  <span key={index}>{string}</span>
                ))}
              </Content>
            </ContentBorder>
          </Scroller>
        </Paper>
        <Footer />
      </Container>
    </>
  );
};

export default Dialogue;

Dialogue.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  Footer: PropTypes.func.isRequired,
};
