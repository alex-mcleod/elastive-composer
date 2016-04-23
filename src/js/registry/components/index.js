import Container from './container';
import Text from './text';
import { StandardComponentEditor } from 'elastive-component';

export default {
  Container,
  Text
};

export default {
  name: 'Basics',
  components: {
    Text: {
      component: Text,
      editableProps: ['text', 'style'],
      editor: StandardComponentEditor
    },
    Container: {
      component: Container,
      editableProps: ['style'],
      editor: StandardComponentEditor
    }
  }
};
