const { add } = require('./app');

test('2 + 3 should equal 5', () => {
    expect(add(2, 3)).toBe(5);
});
