import { Router } from 'express'
import { fetchAllBills, addBill, editBill, removeBill } from '../controllers/bills.controller'

const router_bills = Router()

router_bills.get('/', fetchAllBills)
router_bills.post('/', addBill)
router_bills.put('/:id', editBill)
router_bills.delete('/:id', removeBill)

export default router_bills