function fibonacci(n) {
  if (n === 0) {
    return [0];
  }

  if (n === 1) {
    return [0, 1];
  }

  const previousSequence = fibonacci(n - 1);
  const lastNumber = previousSequence[previousSequence.length - 1];
  const secondLastNumber = previousSequence[previousSequence.length - 2];

  return [...previousSequence, lastNumber + secondLastNumber];
}

// Jangan hapus kode di bawah ini!
export default fibonacci;
