'use strict';
import React from 'react';
import { connect } from 'react-redux';

import * as activityActions from '../../actions/activityfeed';
import { ActivityFeedInvoice } from '../activityfeed/activityfeedinvoice';
import { ActivityFeedTimeslip } from '../activityfeed/activityfeedtimeslip';

const getFeedItem = (item, timeslips, invoices, projects) => {
  const id = `${item.get('item_id')}`;

  switch (item.get('type')) {
    case 'TIM':
      const timeslip = timeslips.get(id);
      return (
        <ActivityFeedTimeslip
          key={item.get('id')}
          item={item}
          project={projects.get(`${timeslip.get('project')}`)}
          timeslip={timeslip}
        />
      );
    case 'INV':
      const invoice = invoices.get(id);
      return (
        <ActivityFeedInvoice
          key={item.get('id')}
          item={item}
          project={projects.get(`${invoice.project}`)}
          invoice={invoice}
        />
      );
  }
};

class ActivityFeed extends React.Component {
  componentDidMount() {
    this.props.fetchActivityFeed();
  }

  render() {
    const activityFeed = this.props.activityFeed;
    const timeslips = this.props.timeslips;
    const projects = this.props.projects;
    const invoices = this.props.invoices;

    return (
      <div className="activity-feed">
        <h4>Activity Feed</h4>
        <div className="activity-feed-items">
          {activityFeed.map((item) =>
            getFeedItem(item, timeslips, invoices, projects)
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    timeslips: state.timeslip.items,
    invoices: state.invoice.items,
    activityFeed: state.activityFeed.items,
  };
};

const actions = {
  ...activityActions,
};

const ActivityFeedContainer = connect(mapStateToProps, actions)(ActivityFeed);
export { ActivityFeedContainer };
