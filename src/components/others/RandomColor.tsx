const GetRandomColor = (): string => {
  const macaroon_color: string[] = [
    "#d9ffe3",
    "#abfbff",
    "#b5dff7",
    "#ccffcc",
    "#fff6a1",
    "#ffddbf",
    "#ffccff",
    "#ffcffe",
    "#ffdeec",
    "#daffd6",
  ];
  const random_color: string =
    macaroon_color[Math.floor(Math.random() * macaroon_color.length)];
  return random_color;
};

export default GetRandomColor;