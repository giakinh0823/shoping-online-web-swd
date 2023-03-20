import * as React from 'react';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import './App.css';
import { useState, useEffect } from 'react';

const stackTokens = { childrenGap: 50 };
const iconProps = { iconName: 'Calendar' };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };

const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};
type StackProps = {
  key: string;
};

interface Product {
  id: number;
  name: string;
  quantity: number;
  type: string;
  description: string;
  price: number;
  count: number;
};
const requestCreate = ""
const requestUpdate = ""

const handleCreate = async () => {
  try {
    const response = await fetch(requestCreate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify("newItemData")
    });
    if (response.ok) {
      // Handle success response
    } else {
      throw new Error('Failed to create item');
    }
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

const handleUpdate = async (id: any) => {
  try {
    const request = requestUpdate + String(id)
    const response = await fetch(requestUpdate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify("newItemData")
    });
    if (response.ok) {
      // Handle success response
    } else {
      throw new Error('Failed to create item');
    }
  } catch (error) {
    console.error(error);
    // Handle error
  }
}


export const App: React.FunctionComponent = () => {
  const [list, setList] = useState<Product[]>([])
  const [id, setId] = useState()
  const [product, setProduct] = useState()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState()
  const [type, setType] = useState()
  const [description, setDescription] = useState()
  const [price, setPrice] = useState()
  useEffect(() => {
    try {
      const request = "http://localhost:8084/api/products/list?page=0&limit=3"
      const fetchlist = async () => {
        const response = await fetch(request)
        const responseJSON = await response.json()
        console.log(responseJSON)
        let listprod: Product[] = []

        const data = responseJSON
        let count = 0
        data?.forEach((item: any) => {
          let prod: Product = {
            id: 0,
            name: '',
            quantity: 0,
            type: '',
            description: '',
            price: 0,
            count: 0
          };
          prod.id = item.id ? item.id : 0
          prod.name = item.name != null ? item.name : ''
          prod.quantity = item.quantity != null ? item.quantity : 0
          prod.type = item.type != null ? item.type : ''
          prod.description = item.description != null ? item.description : ''
          prod.price = item.price != null ? item.price : 0
          prod.count = count
          count++
          listprod.push(prod)
        });
        if (listprod) {
          setList(listprod)
        }
      }
      fetchlist()
      console.log(list)
    } catch (error) {
      console.log(error)
    }

  }, [])
  const getDataUpdate = (item: any) => {
    console.log(item)
    setId(item.id)
    setName(item.name)
    setPrice(item.price)
    setQuantity(item.quantity)
    setType(item.type)
    setDescription(item.description)
  };


  return (
    <Stack className='mainForm'>
      <Stack className='header'>
        SWD Shop
      </Stack>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...columnProps}>
          <TextField label="Name" value={name} />
          <TextField label="Quantity" value={quantity} />
        </Stack>
        <Stack {...columnProps}>
          <TextField label="Type" value={type} />
          <TextField label="Price" value={price} />
        </Stack>

      </Stack>
      <Stack className='desc'>
        <TextField className='desc' label="Description" multiline rows={3} value={description} />
      </Stack>
      <Stack className='btncontain' horizontal>
        <DefaultButton className='btnSubmit' text="Create" onClick={handleCreate} />
        <PrimaryButton className='btnSubmit' text="Update" onClick={() => { handleUpdate(id) }} />
      </Stack>
      <Stack className=''>
        <Stack className='headTable'>
          <Stack className='smallcell'>Name</Stack>
          <Stack className='smallcell'>Type</Stack>
          <Stack className='smallcell'>Quantity</Stack>
          <Stack className='smallcell'>Price</Stack>
          <Stack className='bigcell'>Description</Stack>
        </Stack>
        {list.map(item => (
          item.count % 2 === 0 ?
            <Stack className='bodyTable1' key={String(item.count)} onClick={() => {getDataUpdate(item)}}>
              <Stack className='smallcell'>{item.name}</Stack>
              <Stack className='smallcell'>{item.type}</Stack>
              <Stack className='smallcell'>{item.quantity}</Stack>
              <Stack className='smallcell'>{item.price}</Stack>
              <Stack className='bigcell'>{item.description}</Stack>
            </Stack> :
            <Stack className='bodyTable2' key={String(item.count)} onClick={() => {getDataUpdate(item)}}>
              <Stack className='smallcell'>{item.name}</Stack>
              <Stack className='smallcell'>{item.type}</Stack>
              <Stack className='smallcell'>{item.quantity}</Stack>
              <Stack className='smallcell'>{item.price}</Stack>
              <Stack className='bigcell'>{item.description}</Stack>
            </Stack>

        ))}
      </Stack>
    </Stack>
  );
};
