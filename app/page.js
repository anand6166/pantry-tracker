'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)  // Modal starts closed
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} sx={{ backgroundColor: '#B4D6CD' }}>
      <Box
        position="fixed"
        top={20}
        width="100%"
        p={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={1000}  // Ensures the header is on top of other content
      >
        <Typography variant="h1" color="#333">
          Pantry Tracker
        </Typography>
      </Box>
      <Box marginTop="120px" width="100%" display="flex" flexDirection="column" alignItems="center"> {/* Increased marginTop */}
        <Modal open={open} onClose={handleClose}>
          <Box 
            position="absolute" 
            top="50%" 
            left="50%" 
            width={400} 
            bgcolor="white" 
            border="2px solid #000" 
            boxShadow={24}
            p={4} 
            display="flex" 
            flexDirection="column" 
            gap={3}
            sx={{
              transform: "translate(-50%,-50%)" 
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button 
                variant="outlined" 
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >Add</Button>
            </Stack>
          </Box>
        </Modal>
        <Button 
          variant="contained"
          onClick={() => handleOpen()}
          sx={{ marginBottom: 2, }}
        >Add New Item</Button>
        <TextField
          variant="outlined"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2, width: '300px', bgcolor: '#f0f0f0', }}
        />
        <Box border="1px solid #333">
          <Box width="1100px" height="100px"
            bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h3" color="#333">
              Inventory Items
            </Typography>
          </Box>
          <Stack width="1100px" height="400px" overflow="auto" border="1px solid #333" sx={{ backgroundColor: '#f0f0f0' }}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                height="90px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#e0e0e0"
                padding={5}
                borderBottom="1px solid #333"
                sx={{
                  '&:hover': {
                    bgcolor: '#c0c0c0',
                  },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="start"
                  flex={1}
                >
                  <Typography variant="h5" color="#333" textAlign="center">
                    {name}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flex={1}
                >
                  <Typography variant="h5" color="#333" textAlign="center">
                    Count: {quantity}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    onClick={() => addItem(name)}
                  >Add</Button>
                  <Button 
                    variant="contained" 
                    onClick={() => removeItem(name)}
                  >Remove</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
