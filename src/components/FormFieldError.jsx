function FormFieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1 text-sm font-normal text-red-700" id={id} role="alert">
      {message}
    </p>
  );
}

export default FormFieldError;
