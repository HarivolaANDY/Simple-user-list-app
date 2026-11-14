import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { UsersProvider, useUsers } from '../UsersContext';

function TestConsumer() {
  const { users } = useUsers();
  return <Text testID="user-count">{users.length}</Text>;
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

  it('adds a user and updates count', async () => {
    let contextValues: ReturnType<typeof useUsers>;
    function Consumer() {
      contextValues = useUsers();
      return <Text testID="count">{contextValues.users.length}</Text>;
    }

    await act(async () => {
      renderer.create(
        <UsersProvider>
          <Consumer />
        </UsersProvider>
      );
    });

    const initialCount = contextValues!.users.length;
    await act(async () => {
      await contextValues!.addUser({
        firstName: 'Alice',
        lastName: 'Test',
        email: 'alice@test.com',
        age: '30',
      });
    });

    expect(contextValues!.users.length).toBe(initialCount + 1);
    expect(contextValues!.users[0].firstName).toBe('Alice');
  });
});
