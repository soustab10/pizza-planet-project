import React from "react";
import FooterMenu from "./FooterMenu";
import FooterLegal from "./FooterLegal";

export default class Footer extends React.Component {
  render() {
    return (
      <footer className=" flex-container flex-column txt-center txt-white pop-font">
        Pizza Planet &copy; 2023
        <hr />
        <FooterMenu />
        <hr />
        <FooterLegal />
        <hr />
      </footer>
    );
  }
}
