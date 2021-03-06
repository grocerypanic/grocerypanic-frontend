import PropTypes from "prop-types";
import React from "react";
import { Scroller, ContentBorder, Content } from "./dialogue.styles";
import { ItemizedBanner } from "../../global-styles/banner";
import { Paper, Container } from "../../global-styles/containers";
import { HeaderContext } from "../../providers/header/header.provider";
import calculateMaxHeight from "../../util/height";

const Dialogue = ({ headerTitle, title, body, Footer }) => {
  const { updateHeader } = React.useContext(HeaderContext);
  const [listSize, setListSize] = React.useState(calculateMaxHeight());
  const recalculateHeight = () => setListSize(calculateMaxHeight());

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: null,
      transaction: false,
      disableNav: false,
    });
    window.addEventListener("resize", recalculateHeight);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
    };
  }, []); // eslint-disable-line

  return (
    <>
      <Container>
        <Paper>
          <ItemizedBanner className="alert alert-success">
            <div>{title}</div>
          </ItemizedBanner>
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
