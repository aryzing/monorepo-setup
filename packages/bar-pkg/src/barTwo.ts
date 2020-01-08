import add from 'lodash/add';

export const barTwo = () => {
  const myVar1 = 'bar2';
  const ten = add(3, 7);

  return `${myVar1}${ten}`;
};
