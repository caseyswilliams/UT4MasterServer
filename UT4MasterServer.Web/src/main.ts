import { createApp } from 'vue';
import App from './App.vue';
import { router } from './routes';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faCertificate,
  faTrashCan,
  faPlus,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faKey,
  faUserGroup,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons';

library.add(faCopy);
library.add(faCheck);
library.add(faCertificate);
library.add(faPenToSquare);
library.add(faTrashCan);
library.add(faPlus);
library.add(faChevronUp);
library.add(faChevronDown);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faKey);
library.add(faUserGroup);
library.add(faArrowsRotate);

createApp(App).use(router).mount('#app');
