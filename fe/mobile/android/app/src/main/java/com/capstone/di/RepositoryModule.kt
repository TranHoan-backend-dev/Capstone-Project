package com.capstone.di

import com.capstone.data.datasource.AuthRemoteDataSource
import com.capstone.data.repository.AuthRepositoryImpl
import com.capstone.domain.repository.AuthRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
import com.capstone.infrastructure.security.TokenManager
import com.capstone.infrastructure.security.AntiBruteForceManager

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideAuthRepository(
        remote: AuthRemoteDataSource,
        tokenManager: TokenManager,
        bruteForceManager: AntiBruteForceManager
    ): AuthRepository {
        return AuthRepositoryImpl(remote, tokenManager, bruteForceManager)
    }
}
