import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const subscription = gql`
  subscription{
    messageAdded {
      icao24
      // callsign
      // origin_country
      time_position
      last_contact
      longitude
      latitude
      // geo_altitude
      // on_ground
      // velocity
      // heading
      // vertical_rate
      // sensors
      // baro_altitude
      // squawk
      // spi
      // position_source
  }
}
`;

const allFlightsQuery = gql`
  query{
  messages {
    icao24
      callsign
      origin_country
      time_position
      last_contact
      longitude
      latitude
      geo_altitude
      on_ground
      velocity
      heading
      vertical_rate
      sensors
      baro_altitude
      squawk
      spi
      position_source
  }
}
`;

interface Flights {
  icao24: String;
  callsign: String;
  origin_country: String;
  time_position: String;
  last_contact: String;
  longitude: String;
  latitude: String;
  geo_altitude: String;
  on_ground: String;
  velocity: String;
  heading: String;
  vertical_rate: String;
  sensors: String;
  baro_altitude: String;
  squawk: String;
  spi: String;
  position_source: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  flightsSubscription: Subscription;
  flights: Flights[] = [];

  flightsQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.flightsQuery = this.apollo.watchQuery({
      query: allFlightsQuery
    });

    this.flightsSubscription = this.flightsQuery.valueChanges.subscribe(
      ({ data }) => {
        this.flights = [...data.messages];
      }
    );

    this.setupSubscription();
  }

  setupSubscription() {
    this.flightsQuery.subscribeToMore({
      document: subscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newFlight = subscriptionData.data.messageAdded;
        return Object.assign({}, prev, {
          messages: [...prev['messages'], newFlight ]
        });
      }
    });
  }

  ngOnDestroy() {
    this.flightsSubscription.unsubscribe();
  }
}
