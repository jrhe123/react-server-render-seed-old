// src/components/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router';
import { root_page } from '../utilities/urlPath';

export default class NotFoundPage extends React.Component {
  render() {
    return (
        <div>
            <div className="notfound">
                <h1>404</h1>
                <h2>Page not found!test</h2>
                <p>
                    <Link to={root_page}>Go back to the main page</Link>
                </p>
            </div>
        </div>
    );
  }
}