import React from 'react';
import { makeStyles, Theme, createStyles ,createMuiTheme, useTheme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IonLabel } from '@ionic/react';
import blue from '@material-ui/core/colors/blue';

const primary = blue[500];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height:'1em',
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
      clear:'both'
    },
    progress:{
      marginTop:'.5rem',
      width : '88%',
      float : 'left',
      borderRadius:'10px'
    },
    labels:{
      width : '12%',
      float : 'right',
      margin : '0px' ,
      color : '#ccc',
      textAlign:'center'
    },
  }),
);


export default function LinearDeterminate() {
  const classes = useStyles();
  var [completed, setCompleted] = React.useState(0);

  React.useEffect(() => {
    function progress() {
      setCompleted((oldCompleted) => {
        if (oldCompleted === 100) {
          return 0;
        }
        var diff = Math.random() *3.6;
        return Math.min(oldCompleted + diff, 100);
      });
    }

    const timer = setInterval(progress, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.progress}>
        <LinearProgress variant="determinate" value={completed} valueBuffer={completed} color='primary' />
      </div>
      <div className={classes.labels}>
        <IonLabel style={{fontSize:'.7em'}}>{ Math.floor(completed) } %</IonLabel>
      </div>
    </div>
  );
}
