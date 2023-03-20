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

interface Product {
  id: number;
  name: string;
  quantity: number;
  type: string;
  description: string;
  price: number;
  color: number;
};

interface Orderitem {
  productId: any;
  quantity: any;
};

interface OrderShow {
  id: any;
  totalPrice: any;
  status: any;
  color: any
};

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  type: string;
  description: string;
  price: number;
  color: number;
  count: number;
};
const requestCreate = "http://localhost:8084/api/products/create"
const requestCreateOrder = "http://localhost:8084/api/orders"
const requestUpdate = "http://localhost:8084/api/products/update"
const requestDelete = "http://localhost:8084/api/products/delete/"
const requestPay = "http://localhost:8084/api/payment/bill/"

const handleUpdate = async (item: any) => {
  try {
    const response = await fetch(requestUpdate, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
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
        'Content-Type': 'application/json;charset=UTF-8'
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

const handleCreate = async (item: any) => {
  try {
    const response = await fetch(requestCreate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
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

const handleCreateOrder = async (item: any) => {
  try {
    const response = await fetch(requestCreateOrder, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
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

const handlePay = async (id:any) => {
  try {
    const request = requestPay + id
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    });
    const responseJSON = await response.json()
    window.location.href = responseJSON.url
  } catch (error) {
    console.error(error);
    // Handle error
  }
}



export const App: React.FunctionComponent = () => {
  const [list, setList] = useState<Product[]>([])
  const [listOrder, setListOrder] = useState<OrderShow[]>([])
  const [listOrderNow, setListOrderNow] = useState<OrderItem[]>([])
  const [idState, setIdState] = useState('')
  const [product, setProduct] = useState('')
  const [nameState, setNameState] = useState('')
  const [quantityState, setQuantityState] = useState('')
  const [typeState, setTypeState] = useState('')
  const [descriptionState, setDescriptionState] = useState('')
  const [priceState, setPriceState] = useState('')

  const checkExist = (id: any) => {
    var result = false
    listOrderNow?.forEach(item => {
      if (item.id === id) {
        result = true
      }
    });
    return result
  }

  const handleAdd = (id: any) => {
    var temp = [...listOrderNow]
    if (checkExist(id)) {
      temp?.forEach(item => {
        if (item.id === id)
          item.count++
      });
    } else {
      list?.forEach(item => {
        if (item.id === id) {
          let prod = {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            type: item.type,
            description: item.description,
            price: item.price,
            color: listOrderNow.length,
            count: 1
          };
          temp.push(prod)
        }
      });
    }
    setListOrderNow(temp)
    console.log(listOrderNow)
  }
  useEffect(() => {
    try {
      const request = "http://localhost:8084/api/products/list?page=0&limit=100"
      const fetchlist = async () => {
        const response = await fetch(request)
        const responseJSON = await response.json()
        console.log(responseJSON)
        let listprod: Product[] = []

        const data = responseJSON
        let color = 0
        data?.forEach((item: any) => {
          let prod: Product = {
            id: 0,
            name: '',
            quantity: 0,
            type: '',
            description: '',
            price: 0,
            color: 0
          };
          prod.id = item.id ? item.id : 0
          prod.name = item.name != null ? item.name : ''
          prod.quantity = item.quantity != null ? item.quantity : 0
          prod.type = item.type != null ? item.type : ''
          prod.description = item.description != null ? item.description : ''
          prod.price = item.price != null ? item.price : 0
          prod.color = color
          color++
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
    try {
      const request = "http://localhost:8084/api/orders"
      const fetchlistOrders = async () => {
        const response = await fetch(request)
        const responseJSON = await response.json()
        console.log(responseJSON)
        let listOrders: OrderShow[] = []

        const data = responseJSON
        let color = 0
        data?.forEach((item:any) => {
          let status = ''
          if (item.status == 0){
            status = 'Pending'
          }else if(item.status == 1){
            status = 'Success'
          }else{
            status = 'Failed'
          }
          let temp: OrderShow = {
            id: item.id,
            totalPrice : item.totalPrice,
            status: status,
            color: color
          }
          listOrders.push(temp)
          color++
        });
        setListOrder(listOrders)
      }
      fetchlistOrders()
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
            id: idState,
            name: nameState,
            quantity: quantityState,
            type: typeState,
            price: priceState,
            description: descriptionState,
          }
          handleUpdate(item)
        }} />
      </Stack>
      <Stack className='Table'>
        <Stack className='headTable'>
          <Stack className='smallcell'>Name</Stack>
          <Stack className='smallcell'>Type</Stack>
          <Stack className='smallcell'>Quantity</Stack>
          <Stack className='smallcell'>Price</Stack>
          <Stack className='bigcell'>Description</Stack>
          <Stack className='btncell'>Action</Stack>
        </Stack>
        {list.map(item => (
          item.color % 2 === 0 ?
            <Stack className='bodyTable1'>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.name}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.type}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.quantity}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.price}</Stack>
              <Stack className='bigcell' onClick={() => { getDataUpdate(item) }}>{item.description}</Stack>
              <Stack className='btncell'><Button onClick={() => { handleDelete(item.id) }}>Delete</Button> <Button onClick={() => { handleAdd(item.id) }}>Add</Button></Stack>
            </Stack> :
            <Stack className='bodyTable2'>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.name}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.type}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.quantity}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.price}</Stack>
              <Stack className='bigcell' onClick={() => { getDataUpdate(item) }}>{item.description}</Stack>
              <Stack className='btncell'><Button onClick={() => { handleDelete(item.id) }}>Delete</Button> <Button onClick={() => { handleAdd(item.id) }}>Add</Button></Stack>
            </Stack>
        ))}
      </Stack>
      <Stack className='header'>
        Show order
      </Stack>
      <Stack className='Table'>
        <Stack className='headTable'>
          <Stack className='smallcell'>Name</Stack>
          <Stack className='smallcell'>Type</Stack>
          <Stack className='smallcell'>Quantity</Stack>
          <Stack className='smallcell'>Price</Stack>
          <Stack className='bigcell'>Description</Stack>
          <Stack className='smallcell'>Action</Stack>
        </Stack>
        {listOrderNow.map(item => (
          item.color % 2 === 0 ?
            <Stack className='bodyTable1'>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.name}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.type}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.count}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.price}</Stack>
              <Stack className='bigcell' onClick={() => { getDataUpdate(item) }}>{item.description}</Stack>
              <Stack className='smallcell'><Button onClick={() => { handleDelete(item.id) }}>Delete</Button></Stack>
            </Stack> :
            <Stack className='bodyTable2'>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.name}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.type}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.count}</Stack>
              <Stack className='smallcell' onClick={() => { getDataUpdate(item) }}>{item.price}</Stack>
              <Stack className='bigcell' onClick={() => { getDataUpdate(item) }}>{item.description}</Stack>
              <Stack className='smallcell'><Button onClick={() => { handleDelete(item.id) }}>Delete</Button></Stack>
            </Stack>
        ))}
      </Stack>
      <Stack className='btncontain' horizontal>
        <DefaultButton className='btnSubmit' text="Add to cart" onClick={() => {
          var itemSubmit: Orderitem[] = []
          listOrderNow.forEach(item => {
            var temp = {
              productId: item.id,
              quantity: item.count
            }
            itemSubmit.push(temp)
          });
          

          handleCreateOrder({"orders": itemSubmit})
        }} />
      </Stack>

      <Stack className='header'>
        List Order
      </Stack>
      <Stack className='Table'>
        <Stack className='headTable'>
          <Stack className='smallcell'>No.</Stack>
          <Stack className='smallcell'>Price</Stack>
          <Stack className='smallcell'>Status</Stack>
          <Stack className='smallcell'>Action</Stack>
        </Stack>
        {listOrder?.map(item => (
          item.color % 2 === 0 ?
            <Stack className='bodyTable1'>
              <Stack className='smallcell'>{item.color}</Stack>
              <Stack className='smallcell'>{item.totalPrice}</Stack>
              <Stack className='smallcell'>{item.status}</Stack>
              <Stack className='smallcell'><Button onClick={() => { handlePay(item.id) }}>Pay now!</Button></Stack>
            </Stack> :
            <Stack className='bodyTable2'>
              <Stack className='smallcell'>{item.color}</Stack>
              <Stack className='smallcell'>{item.totalPrice}</Stack>
              <Stack className='smallcell'>{item.status}</Stack>
              <Stack className='smallcell'><Button onClick={() => { handlePay(item.id) }}>Pay now!</Button></Stack>
            </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
