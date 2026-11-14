import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { UsersProvider, useUsers } from '../../context/UsersContext';

function TestConsumer() {
  const { users, addUser, deleteUser } = useUsers();
  return (
    <>
      <Text testID="user-count">{users.length}</Text>
      <Text testID="user-names">{users.map((u) => u.firstName).join(',')}</Text>
    </>
  );
}

describe('UsersContext', () => {
  it('loads initial users and renders count', async () => {
    let tree: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <UsersProvider>
          <TestConsumer />
        </UsersProvider>
      );
    });

    const root = tree!.root;
    const countText = root.findByProps({ testID: 'user-count' });
    expect(parseInt(countText.props.children, 10)).toBeGreaterThan(0);
  });
});
