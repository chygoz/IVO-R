const URL = `${process.env.SERVER_API_URL}/api/v1/collections`;

type Collection = {
  name: string;
  description: string;
};

const getCollection = async (id: string): Promise<{ data: Collection }> => {
  const res = await fetch(`${URL}/${id}`);

  return res.json();
};

export default getCollection;
