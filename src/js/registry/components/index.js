import Container from './container';
import Text from './text';

export default {
  Container,
  Text
};

export default {
  name: 'Basics',
  components: {
    Text: {
      component: Text,
      editableProps: ['text', 'style']
    },
    Container: {
      component: Container,
      editableProps: ['style']
    }
  }
};
