import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { FilterDto } from '../../core/interfaces/filter.dto';
import { CreateOrderItemDto } from '../../orders/dtos/order-item.dto';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { OrderItemService } from './order-item.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,

    @Inject(forwardRef(() => OrderItemService))
    private orderItemService: OrderItemService
  ) {}

  findAll(params?: FilterDto, userId?: number) {
    const { limit, offset } = params;
    return this.orderRepo.find({
      take: limit,
      skip: offset,
      where: { user: { id: userId } },
      loadRelationIds: { relations: ['items'] },
    });
  }

  async findOne(orderId: number, withRelations = true) {
    const order = await this.orderRepo.findOne({
      relations: withRelations ? ['items', 'items.product'] : [],
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.userRepo.findOneBy({ id: createOrderDto.userId });
    const newOrder = this.orderRepo.create({ user });
    return this.orderRepo.save(newOrder);
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(orderId);
    const user = await this.userRepo.findOneBy({ id: updateOrderDto.userId });
    order.user = user;
    return this.orderRepo.save(order);
  }

  async removeItem(orderId, itemId) {
    const order = await this.findOne(orderId);
    order.items = order.items.filter(item => item.id !== itemId);
    return this.orderRepo.save(order);
  }

  async addItem(orderId: number, createOrderItem: CreateOrderItemDto) {
    return this.orderItemService.create(orderId, createOrderItem);
  }

  public async remove(id: number) {
    await this.findOne(id);
    return this.orderRepo.softDelete({ id });
  }

  public async restore(id: number) {
    return this.orderRepo.restore({ id });
  }
}
