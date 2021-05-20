const clientIds = [
  "5385981a-4a25-4b3b-8502-53169eb5ad1f",
  "8ad535a3-faa9-48b6-82cd-e20064339edf",
  "ef7cf1c3-c395-46f4-b994-4d5e5f296f67",
  "35121f36-dbf3-4442-a88a-64f58d86973f",
  "11a078ad-6b45-4573-a54f-1de822447752",
  "2d2ea51b-3b1f-4434-804f-8f2e2b6ce5b1",
  "cb98023f-e048-4965-bb55-b5e838e015f9",
  "77c60bb2-46e8-42bd-9571-5952d7e67075",
  "c6ebcce2-77e7-4ba4-a4f7-22ab58b642a4",
  "4c5ae5ee-63b8-4a2e-871b-f5a687458c27",
  "2a620826-89ca-41df-8eaf-4760611c7646",
  "1e12af26-1f62-4d14-ae3e-9b346782113d",
  "52067f75-ec30-4fb9-9b20-ef40a66c8a58",
  "45c95548-07d2-4635-b7d6-b5ca4fa3de5e",
  "204c792b-c761-4829-9384-29435185cc8a",
  "0b210415-96c7-42ba-9226-5dc757ac968d",
  "6d0eaad8-e6d2-4aae-9e83-dc7a9a662d35",
  "115ab03d-27aa-4779-9680-f48c6ae7afd7",
  "ef9f86c5-dff4-47e4-8015-00c47dc7cb7b",
  "604aa69a-1494-498c-86e2-c6928d697eb5",
  "a18142e3-0336-421c-9d73-84a0fcd9821b",
  "5c94b2a1-ac46-4b0e-b59e-9ae6da1f29e8",
  "0b29eec0-ae60-472f-96c3-cae7d55ea071",
  "9f90729c-2278-4689-aaef-7ebf6c372c8f",
  "3a85a0b8-5494-483d-ba62-8a0f2615818e",
  "a85affc5-e9c0-40c6-8289-73ec624fda41",
  "c7e08293-742e-4293-b0db-bf694f9f87f8",
  "e2b115dc-a395-4494-a39c-f49e61dfb184",
  "e03f745a-2fca-45b2-b285-73f1973d9be1",
  "3214ad55-e373-4c9e-9c30-a6a55073a984",
  "5df746d7-f5ce-4c0e-a540-50042211b43d",
  "b0c969c2-f801-4e52-a001-6cfe1648298d",
  "11ac3360-ffb5-4ee7-88d3-68f6286f774d",
  "0011f2a1-8270-4020-a13f-11c851537e53",
  "461b5a8f-0c3c-47b0-b892-7478ac1c0f93",
  "800f2a2a-e207-4b71-b077-b757800ab531",
  "c2d9755a-a467-41b0-8187-46df422f28cb",
  "c4cac2de-d254-4396-a55a-6fc1cc818831",
  "aa49ae69-ee6f-4dad-b205-8f86b7f54bd0",
  "f1735545-4832-48da-b629-9a93d825d8ab",
  "83c3ee66-ca52-4d20-8a6e-6ddb9857a989",
  "26c78fdb-79ec-4d8e-8d7f-cbbf5462b715",
  "020005cd-315b-4358-9ff9-68ca5b226013",
  "d9b5b1a8-fe07-4ccb-9352-fcca17574e64",
  "07bfccd3-4199-4894-8b53-6cd1282b0c9b",
  "6e4ff73b-ba95-4103-8bba-e1eaf2d67a17",
  "c12e8100-5450-4e9f-be9c-b75e81d9b17d",
  "ea605e7e-544a-472f-ab8c-d00873383415",
  "4393a9c2-970f-44ef-a8ba-4939ab96efdc",
  "34a3f3e2-633f-4e58-8ac4-26cfb0e2e7bc"
]

function* idGenerator(){
  let i = 0;

  while (true){
    yield i++;
  }
}

const getId = idGenerator();

/**
 * Returns next index of clientIds
 * @returns {string}
 */
const getNextId = () => clientIds[getId.next().value];

module.exports = {
  clientIds,
  getNextId
};
