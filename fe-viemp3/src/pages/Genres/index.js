import React, { useEffect, useState } from 'react';
import icons from '~/assets/icons';
import styles from './Genres.module.scss';
import classNames from 'classnames/bind';
import LimitedList from '~/components/Components/LimitedList';
import { RectangleCard } from '~/components/Components/Card';

const cx = classNames.bind(styles);

function Genres() {
  const genres = [
    {
      id: '47cd9c9e-5eb7-45fa-9a10-69c10fd10091',
      name: 'ACOUSTIC',
    },
    {
      id: '718cec45-aad0-4101-89ba-16c671845f14',
      name: 'BALLAD',
    },
    {
      id: 'db66d3bd-006c-45f6-ae1c-01de9c8a6339',
      name: 'DANCE',
    },
    {
      id: '5d266a6c-e375-4268-a63c-c4c3131f588f',
      name: 'FUNK',
    },
    {
      id: 'e263a2f6-eb41-4f58-bf93-001b69bb1e11',
      name: 'HIPHOP',
    },
    {
      id: '69c2560a-5262-4dec-b9de-3de60dc6eff7',
      name: 'INDIE',
    },
    {
      id: 'cc0d19cc-b395-4960-9f1a-7146ad6ad16f',
      name: 'LOFI',
    },
    {
      id: 'a12eaec3-56cb-4c78-a131-600012fad5b4',
      name: 'POP',
    },
    {
      id: '0335a443-93b2-4683-a1f4-ec3a555ec63f',
      name: 'RAP',
    },
    {
      id: '7623ebc4-1cf5-4303-98fa-18567be09a9a',
      name: 'REMIX',
    },
    {
      id: 'd6dfed87-c187-40c5-bf15-7e4684da0b62',
      name: 'RNB',
    },
  ];

  return (
    <div className="container">
      <h1 className="text-center mb-4">
        <i className={icons.iconLayerGroup}></i>
        <span className="ps-2">Thể loại nhạc</span>
      </h1>

      <section className={cx('section-block')}>
        <LimitedList
          items={genres}
          limit={6}
          renderItem={(genre, index) => (
            <div key={genre.id} className="col-12 col-sm-12 col-md-4 mb-3 d-flex justify-content-center">
              <RectangleCard
                content={genre.name}
                desc={genre.description}
                href={`/genre/${genre.id}`}
                icon={<i className={`${icons.iconMusic} fa-3x`}></i>}
              />
            </div>
          )}
        />
      </section>
    </div>
  );
}

export default Genres;
