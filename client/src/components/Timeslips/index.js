import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import moment from 'moment';

import Button from 'components/Button';
import NavMenu from 'components/nav/navmenu';
import {BREAKPOINTS, Container, Grid, Cell} from 'components/Grid';

import {TimeslipGrid} from './timeslipgrid';
import TimeslipDateControls from './timeslipdatecontrols';
import {Loading} from '../loading';
import {fetchTimeslips, saveTimeslips} from 'modules/timeslip';

const Styled = styled.div`
  background: #f5f3f5;
  margin-top: 12px;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  height: 100%;
  max-width: 1200px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;

  @media(max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
`;

const Summary = styled.div`
  background: white;
  color: #4e5767;
  height: 100%;
  width: 290px;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);

  @media(max-width: ${BREAKPOINTS.sm}) {
    height: auto;
    width: 100%;
    margin-bottom: 16px;
  }
`;

class Timeslips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekStart: moment().startOf('isoweek').isoWeekday(1),
      updatedTimeslips: {}, // keyed by project_date
    };

    this.handleSetActiveDate = this.handleSetActiveDate.bind(this);
    this.handleSetHour = this.handleSetHour.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const {weekStart} = this.state;
    const end = moment(weekStart).add(7, 'days');

    this.props.fetchTimeslips(
      null, weekStart.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')
    )
  }

  handleSetActiveDate(weekStart) {
    this.setState({weekStart}, () => this.fetchData());
  }

  handleSetHour(project, date, hours, timeslip) {
    const {updatedTimeslips} = this.state;
    const isUpdated = Boolean(timeslip);
    const key = `${project.id}_${date}`;

    this.setState({
      updatedTimeslips: {
        ...updatedTimeslips,
        [key]: {
          project: project.id,
          isNew: !isUpdated,
          id: isUpdated ? timeslip.id : null,
          isUpdated,
          hours,
          date,
        }
      }
    });
  }

  handleSave() {
    const {saveTimeslips, timeslips} = this.props;
    const {updatedTimeslips} = this.state;

    saveTimeslips(
      Object.values(updatedTimeslips)
    ).then(() => {
      this.setState({updatedTimeslips: []});
    });
  }

  render() {
    const {weekStart, updatedTimeslips} = this.state;
    const {user, timeslips, projects} = this.props;
    const today = moment();
    const month = weekStart.format('MMMM Y');
    const displayTimeslips = timeslips.concat(Object.values(updatedTimeslips));

    return (
      <React.Fragment>
        <NavMenu />
        <Container>
          <Styled>
            <TimeslipGrid
              today={today}
              isLoading={this.props.isLoading}
              weekStart={weekStart}
              timeslips={displayTimeslips}
              projects={projects}
              onHourChanged={this.handleSetHour}
              onInvoice={this.props.onInvoice}
              onSetActiveDate={this.handleSetActiveDate}
            />
            <Summary>
              <Button
                onClick={this.handleSave}
                label='Save'
                className='btn-success'
                disabled={this.props.isSaving}
              />
            </Summary>
          </Styled>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSaving: false,
    isLoading: false,
    timeslips: Object.values(state.timeslip.items),
    projects: state.project.items,
    user: state.user.user
  };
};

const actions = {
  fetchTimeslips,
  saveTimeslips,
};

export default connect(mapStateToProps, actions)(Timeslips);
