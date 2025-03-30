import rabbit from '@/assets/animals/rabbit.svg';
import wolf from '@/assets/animals/wolf.svg';
import snake from '@/assets/animals/snake.svg';
import cat from '@/assets/animals/cat.svg';
import dog from '@/assets/animals/dog.svg';
import bat from '@/assets/animals/bat.svg';
import lamp from '@/assets/rythemGame/lamp.svg';
import king from '@/assets/rythemGame/king.svg';
import cow from '@/assets/animals/cow.svg';
import chair from '@/assets/rythemGame/chair.svg';
import stamp from '@/assets/rythemGame/stamp.svg';
import cake from '@/assets/rythemGame/cake.svg';
import frog from '@/assets/animals/frog.svg';
import star from '@/assets/rythemGame/star.svg';
import bear from '@/assets/animals/bear.svg';
import balloon from '@/assets/balloon.svg';
import spoon from '@/assets/rythemGame/spoon.svg';
import train from '@/assets/cars/high-speed-rail.svg';
import cloud from '@/assets/rythemGame/cloud.svg';
import rain from '@/assets/rythemGame/rain.svg';
import apple from '@/assets/memoryIcons/apple.svg';
import lion from '@/assets/animals/lion.svg';
import banana from '@/assets/memoryIcons/banana.svg';
import fish from '@/assets/animals/fish.svg';
import car from '@/assets/cars/car.svg';
import bell from '@/assets/rythemGame/bell.svg';
import moon from '@/assets/rythemGame/moon.svg';
import hat from '@/assets/rythemGame/hat.svg';
import crown from '@/assets/rythemGame/crown.svg';
import ring from '@/assets/rythemGame/ring.svg';


export const RHYMING_SETS = {
    1: [
      {
        target: { word: 'cat', image: cat },
        options: [
          { word: 'king', image: king, correct: false },
          { word: 'dog', image: dog, correct: false },
          { word: 'bat', image: bat, correct: true }
        ]
      },
      {
        target: { word: 'lamp', image: lamp },
        options: [
          { word: 'cow', image: cow, correct: false },
          { word: 'chair', image: chair, correct: false },
          { word: 'stamp', image: stamp, correct: true }
        ]
      },
      {
        target: { word: 'cake', image:  cake },
        options: [
          { word: 'snake', image: snake, correct: true },
          { word: 'apple', image: apple, correct: false },
          { word: 'lion', image: lion, correct: true }
        ]
      }
    ],
    2: [
      {
        target: { word: 'frog', image: frog },
        options: [
          { word: 'dog', image: dog, correct: true },
          { word: 'banana', image: banana, correct: false },
          { word: 'fish', image: fish, correct: false }
        ]
      },
      {
        target: { word: 'star', image: star },
        options: [
          { word: 'car', image: car, correct: true },
          { word: 'bell', image: bell, correct: false },
          { word: 'moon', image: moon, correct: false }
        ]
      },
      {
        target: { word: 'bear', image: bear },
        options: [
          { word: 'hat', image: hat, correct: false },
          { word: 'chair', image: chair, correct: true },
          { word: 'lion', image: lion, correct: false }
        ]
      }
    ],
    3: [
      {
        target: { word: 'king', image: king },
        options: [
          { word: 'ring', image: ring, correct: true },
          { word: 'frog', image: frog, correct: false },
          { word: 'crown', image: crown, correct: false }
        ]
      },
      {
        target: { word: 'balloon', image: balloon },
        options: [
          { word: 'spoon', image: spoon, correct: true },
          { word: 'king', image: king, correct: false },
          { word: 'lamp', image: lamp, correct: false }
        ]
      },
      {
        target: { word: 'rain', image: rain },
        options: [
          { word: 'train', image: train, correct: true },
          { word: 'moon', image: moon, correct: false },
          { word: 'cloud', image: cloud, correct: false }
        ]
      }
    ]
  };

 export const characters = [
    { name: 'Rhyme Rabbit', image: rabbit, color: '#FFD6E0' },
    { name: 'Word Wolf', image: wolf, color: '#C8E7FF' },
    { name: 'Sound Snake', image: snake, color: '#D8F8E1' }
  ];