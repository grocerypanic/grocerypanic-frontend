import React from "react";

export const MockComponentContents = <div>MockComponent</div>;

const MockComponent = jest.fn();
MockComponent.mockImplementation(() => MockComponentContents);

export default MockComponent;
