import * as React from 'react';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import { Button, DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
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
const requestCreate = "http://localhost:8084/api/products/create"
const requestUpdate = "http://localhost:8084/api/products/update"
const requestDelete = "http://localhost:8084/api/products/delete/"



const handleUpdate = async ( item: any) => {
  try {
    const response = await fetch(requestUpdate, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    if (response.ok) {
      window.location.reload()
    } else {
      throw new Error('Failed to create item');
    }
  } catch (error) {
    console.error(error);
    // Handle error
  }
}
const handleDelete = async (id: any) => {
  try {
    const request = requestDelete + String(id)
    const response = await fetch(request, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      window.location.reload()
    } else {
      throw new Error('Failed to create item');
    }
  } catch (error) {
    console.error(error);
    // Handle error
  }
}
const handleCreate = async (item:any) => {
  try {
    const response = await fetch(requestCreate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    if (response.ok) {
      window.location.reload()
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
  const [idState, setIdState] = useState('')
  const [product, setProduct] = useState('')
  const [nameState, setNameState] = useState('')
  const [quantityState, setQuantityState] = useState('')
  const [typeState, setTypeState] = useState('')
  const [descriptionState, setDescriptionState] = useState('')
  const [priceState, setPriceState] = useState('')
  useEffect(() => {
    try {
      const request = "http://localhost:8084/api/products/list?page=0&limit=100"
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
    setIdState(item.id)
    setNameState(item.name)
    setPriceState(item.price)
    setQuantityState(item.quantity)
    setTypeState(item.type)
    setDescriptionState(item.description)
  };

  const changeName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    var value = newValue;
    setNameState(String(value))
    console.log(nameState)
  }
  const changeQuantity = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    var value = newValue;
    setQuantityState(String(value))
    console.log(quantityState)
  }
  const changeType = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    var value = newValue;
    setTypeState(String(value))
    console.log(typeState)
  }
  const changePrice = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    var value = newValue;
    setPriceState(String(value))
  }
  const changeDescription = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    var value = newValue;
    setDescriptionState(String(value))
  }


  return (
    <Stack className='mainForm'>
      <Stack className='header'>
        SWD Shop
      </Stack>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...columnProps}>
          <TextField label="Name" value={nameState} onChange={changeName} />
          <TextField type='number' label="Quantity" value={quantityState} onChange={changeQuantity} />
        </Stack>
        <Stack {...columnProps}>
          <TextField label="Type" value={typeState} onChange={changeType} />
          <TextField type='number' label="Price" value={priceState} onChange={changePrice} />
        </Stack>

      </Stack>
      <Stack className='desc'>
        <TextField className='desc' label="Description" multiline rows={3} value={descriptionState} onChange={changeDescription} />
      </Stack>
      <Stack className='btncontain' horizontal>
        <DefaultButton className='btnSubmit' text="Create" onClick={() => {
          let item = {
            name: nameState,
            quantity: quantityState,
            type: typeState,
            price: priceState,
            description: descriptionState,
          }
          handleCreate(item)
          }} />
        <PrimaryButton className='btnSubmit' text="Update" onClick={() => {
          let item = {
            id : idState,
            name: nameState,
            quantity: quantityState,
            type: typeState,
            price: priceState,
            description: descriptionState,
          }
          handleUpdate(item)
          }}/>
      </Stack>
      <Stack className=''>
        <Stack className='headTable'>
          <Stack className='smallcell'>Name</Stack>
          <Stack className='smallcell'>Type</Stack>
          <Stack className='smallcell'>Quantity</Stack>
          <Stack className='smallcell'>Price</Stack>
          <Stack className='bigcell'>Description</Stack>
          <Stack className='smallcell'>Action</Stack>
        </Stack>
        {list.map(item => (
          item.count % 2 === 0 ?
            <Stack className='bodyTable1' key={String(item.count)} onClick={() => { getDataUpdate(item) }}>
              <Stack className='smallcell'>{item.name}</Stack>
              <Stack className='smallcell'>{item.type}</Stack>
              <Stack className='smallcell'>{item.quantity}</Stack>
              <Stack className='smallcell'>{item.price}</Stack>
              <Stack className='bigcell'>{item.description}</Stack>
              <Stack className='smallcell'><Button onClick={() => { handleDelete(item.id) }}>Delete</Button></Stack>
            </Stack> :
            <Stack className='bodyTable2' key={String(item.count)} onClick={() => { getDataUpdate(item) }}>
              <Stack className='smallcell'>{item.name}</Stack>
              <Stack className='smallcell'>{item.type}</Stack>
              <Stack className='smallcell'>{item.quantity}</Stack>
              <Stack className='smallcell'>{item.price}</Stack>
              <Stack className='bigcell'>{item.description}</Stack>
              <Stack className='smallcell'><Button onClick={() => { handleDelete(item.id) }}>Delete</Button></Stack>
            </Stack>

        ))}
      </Stack>
    </Stack>
  );
};
