import React from 'react';

export default class Html extends React.Component {

  render() {
    const {webpackAssets, markup, state} = this.props;

    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <link href='http://fonts.googleapis.com/css?family=PT+Serif:400,700'
                rel='stylesheet' type='text/css' />
          {webpackAssets['app.css'] &&
            <link href={webpackAssets['app.css']} rel='stylesheet' type='text/css'/>
          }
          <title>project.name</title>
        </head>
        <body>
        <div id='app' dangerouslySetInnerHTML={{__html: markup}} />
          <script dangerouslySetInnerHTML={{__html: `window._app_state_ = ${JSON.stringify(state)};`}} />
          <script src={webpackAssets['vendor.js']} />
          <script src={webpackAssets['app.js']} />
        </body>
      </html>
    );
  }

}
