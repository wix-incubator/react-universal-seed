import 'babel-polyfill';
import path from 'path';
import React from 'react';
import axios from 'axios';
import ejs from 'ejs';
import Promise from 'bluebird';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import express from 'express';
import createRoutes from './routes';
import configureStore from './store/configureStore';
import fetchData from './fetch-data';

module.exports = ({baseURL}) => {
  const app = express();
  axios.defaults.baseURL = baseURL;

  app.get('/sites', (req, res) => {
    //TODO: Implement api logic here
    res.json([
      {id: 1, siteName: 'Site 1'},
      {id: 2, siteName: 'Site 2'}
    ]);
  });

  app.get('*', (req, res) => {
    const axiosInstance = axios.create({
      baseURL: axios.defaults.baseURL,
      headers: req.headers
    });

    const templatePath = path.resolve('./src/index.ejs');
    const store = configureStore({}, axiosInstance);
    const routes = createRoutes(store);

    match({routes, location: req.url}, async (err, redirect, props) => {
      if (err) {
        res.status(500).json(err);
      } else if (redirect) {
        res.redirect(302, redirect.pathname + redirect.search);
      } else if (!props) {
        res.sendStatus(404);
      } else {

        const {components, params} = props;
        await fetchData(store.dispatch, components, params);
        const initialState = store.getState();

        const html = renderToString(
          <Provider store={store}>
            <RouterContext {...props}/>
          </Provider>
        );

        const data = {initialState, html, baseURL, staticsBaseUrl: 'http://localhost:3200/'}; //TODO: fix

        const renderFile = await Promise.promisify(ejs.renderFile, {context: ejs});

        const htmlData = await renderFile(templatePath, data);

        res.send(htmlData);
      }
    });
  });

  return app;
};
